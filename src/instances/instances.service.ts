import {Injectable} from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Instance, InstanceDocument} from "./schemas/instance.schema";
import {CreateInstanceDto, UpdateInstanceTimestampDto, DeleteInstanceDto, GroupDto} from "./dto";


@Injectable()
export class InstancesService {
    constructor(
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
            console.log('current: ', current)
            console.log('result: ', result)

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

    async findOne(id: string): Promise<Instance> {
        const query = {id}
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

    async remove(query: DeleteInstanceDto) {
        await this.instanceModel.remove(query).exec();
    }
}
