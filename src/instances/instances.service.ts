import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Instance, InstanceDocument} from "./schemas/instance.schema";
import {CreateInstanceDto, UpdateInstanceTimestampDto, DeleteInstanceDto} from "./dto";


@Injectable()
export class InstancesService {
  constructor(
      @InjectModel(Instance.name) private readonly instanceModel: Model<InstanceDocument>,
  ) {}

  async create(createInstanceDto: CreateInstanceDto): Promise<Instance> {
    const createdInstance = new this.instanceModel(createInstanceDto);
    return createdInstance.save();
  }

  findAll() {
    return `This action returns all instances`;
  }

  async findOne(id: string): Promise<Instance> {
    const query ={ id }
    const select ={ _id: 0, __v: 0 }
    return this.instanceModel.findOne(query, select).exec();
  }


  // it isn't specified, should update meta or not
  async updateTimestamp(updateInstanceTimestampDto: UpdateInstanceTimestampDto) {
    const { updatedAt, ...query } = updateInstanceTimestampDto
    await this.instanceModel.updateOne(query, {$set: {updatedAt}}).exec();
  }

  async remove(query: DeleteInstanceDto) {
    await this.instanceModel.remove(query).exec();
  }
}
