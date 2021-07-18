import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Instance, InstanceDocument } from './schemas/instance.schema';
import {
  IdentifyInstanceDto,
  CreateInstanceDto,
  UpdateInstanceDto,
  GroupDto,
} from './dto';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { groupsSummaryReducer } from './helpers/groups-summary-reducer';

config();
const InstanceExpirationTimeMsDefault = 1 * 60 * 1000;
const InstanceExpirationCheckIntervalMsDefault =
  InstanceExpirationTimeMsDefault / 2;
const InstanceExpirationCheckIntervalMs =
  Number(process.env.INSTANCE_EXPIRATION_CHECK_INTERVAL_MS) ||
  InstanceExpirationCheckIntervalMsDefault;

@Injectable()
export class InstancesService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Instance.name)
    private readonly instanceModel: Model<InstanceDocument>,
  ) {}

  private readonly fieldsToHideSelector = { _id: 0, __v: 0 };
  private readonly logger = new Logger(InstancesService.name);

  async create(createInstanceDto: CreateInstanceDto): Promise<Instance> {
    const createdInstance = new this.instanceModel(createInstanceDto);

    return createdInstance.save();
  }

  async getGroups(): Promise<GroupDto[]> {
    const select = {
      ...this.fieldsToHideSelector,
      id: 0,
      meta: 0,
    };
    const instances = await this.instanceModel.find({}, select).exec();
    const preparedInstances = instances.reduce(groupsSummaryReducer, {});

    return Object.values(preparedInstances);
  }

  async findOne(query: IdentifyInstanceDto): Promise<Instance | null> {
    return this.instanceModel.findOne(query, this.fieldsToHideSelector).exec();
  }

  async getGroupInstances(group: string): Promise<Instance[]> {
    const query = { group };

    return this.instanceModel.find(query, this.fieldsToHideSelector).exec();
  }

  // it isn't specified, should meta be updated or not
  // I decided that we shouldn't lose a possible new meta
  async updateTimestamp(UpdateInstanceDto: UpdateInstanceDto) {
    const { updatedAt, meta, ...query } = UpdateInstanceDto;
    const updater = { $set: { updatedAt, meta } };
    await this.instanceModel.updateOne(query, updater).exec();
  }

  async remove(query: IdentifyInstanceDto) {
    await this.instanceModel.remove(query).exec();
  }

  // it's impossible to use an enviroment variable inside a decorator with '@nestjs/config'
  // so, if we want to do it, we have to use the native dotenv config
  @Interval(InstanceExpirationCheckIntervalMs)
  async removeExpiredInstances() {
    this.logger.log(
      'removeExpiredInstances -- periodic job started',
    );
    const instanceExpirationTimeInMs =
      Number(this.configService.get<string>('INSTANCE_EXPIRATION_TIME_MS')) ||
      InstanceExpirationTimeMsDefault;
    const dateNow = Date.now();
    const theEdge = dateNow - instanceExpirationTimeInMs;
    const query = { updatedAt: { $lte: theEdge } };
    const { deletedCount } = await this.instanceModel.deleteMany(query);
    this.logger.log(
      `removeExpiredInstances -- amount of deleted instances: ${deletedCount}`
    );
    this.logger.log(
      'removeExpiredInstances -- periodic job finished',
    );
  }
}
