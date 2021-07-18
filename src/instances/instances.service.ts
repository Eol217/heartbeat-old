import {Injectable} from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Instance, InstanceDocument} from "./schemas/instance.schema";
import { IdentifyInstanceDto, CreateInstanceDto, UpdateInstanceTimestampDto, GroupDto} from "./dto";
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv'


config()
const InstanceExpirationTimeMsDefault = 1*60*1000
const InstanceExpirationCheckIntervalMsDefault = InstanceExpirationTimeMsDefault / 2
const InstanceExpirationCheckIntervalMs = Number(process.env.INSTANCE_EXPIRATION_CHECK_INTERVAL_MS)
    || InstanceExpirationCheckIntervalMsDefault


@Injectable()
export class InstancesService {
    constructor(
        private configService: ConfigService,
        @InjectModel(Instance.name) private readonly instanceModel: Model<InstanceDocument>,
    ) {
    }

    readonly fieldsToHideSelector = {_id: 0, __v: 0}

    async create(createInstanceDto: CreateInstanceDto): Promise<Instance> {
        const createdInstance = new this.instanceModel(createInstanceDto);
        return createdInstance.save();
    }

    async getGroups(): Promise<GroupDto[]> {
        const select = {
            ...this.fieldsToHideSelector,
            id: 0,
            meta: 0,
        }
        const instances = await this.instanceModel.find({}, select).exec();
        const preparedInstances = instances.reduce((result, current) => {
            const {group, createdAt, updatedAt} = current
            const groupInfo = result[group]

            if (!groupInfo) {
                result[group] = {
                  group,
                  instances: "1",
                  createdAt,
                  updatedAt,
                }

                return result
            }

            result[group].instances = String(++groupInfo.instances)
            result[group].createdAt = Math.min(groupInfo.createdAt, createdAt)
            result[group].updatedAt = Math.max(groupInfo.updatedAt, updatedAt)

            return result
        }, {})

        return Object.values(preparedInstances)
    }

    async findOne(query: IdentifyInstanceDto): Promise<Instance> {
        return this.instanceModel.findOne(query, this.fieldsToHideSelector).exec();
    }

    async getGroupInstances(group: string): Promise<Instance[]> {
        const query = {group}

        return this.instanceModel.find(query, this.fieldsToHideSelector).exec();
    }


    // it isn't specified, should update meta or not
    async updateTimestamp(updateInstanceTimestampDto: UpdateInstanceTimestampDto) {
        const {updatedAt, ...query} = updateInstanceTimestampDto
        await this.instanceModel.updateOne(query, {$set: {updatedAt}}).exec();
    }

    async remove(query: IdentifyInstanceDto) {
        await this.instanceModel.remove(query).exec();
    }

    // it's impossible to use an enviroment variable inside a decorator with '@nestjs/config'
    // so, if we want to do it, we have to use the native dotenv config
    @Interval(InstanceExpirationCheckIntervalMs)
    async removeExpiredInstances() {
        const instanceExpirationTimeInMs = Number(this.configService.get<string>('INSTANCE_EXPIRATION_TIME_MS'))
            || InstanceExpirationTimeMsDefault
        const dateNow = Date.now()
        const theEdge = dateNow - instanceExpirationTimeInMs

        const query = { updatedAt: { $lte: theEdge } }
        const amount = await this.instanceModel.deleteMany(query)
        console.log('amount of deleted instances: ', amount.deletedCount)
    }
}

