import { Injectable } from '@nestjs/common';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceTimestampDto } from './dto/update-instance-timestamp.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Instance, InstanceDocument} from "./schemas/instance.schema";
import {FormatInstanceDto} from "./dto/format-instance.dto";


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
    return this.instanceModel.findOne({id}).exec();
  }


  // it isn't specified, should update meta or not
  async updateTimestamp(id: string, updatedAt: number) {
    await this.instanceModel.updateOne({id}, {$set: {updatedAt}}).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} instance`;
  }
}
