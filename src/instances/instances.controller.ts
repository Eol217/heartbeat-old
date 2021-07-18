import {Controller, Get, Post, Body, Patch, Param, Delete, Res, Response} from '@nestjs/common';
import {InstancesService} from './instances.service';
import { CreateInstanceDto, UpdateInstanceTimestampDto, IdentifyInstanceDto } from './dto';
import {DoesInstanceExistPipe} from "./pipes/does-instance-exist.pipe";
import _ from 'lodash'

@Controller()
export class InstancesController {
    constructor(private readonly instancesService: InstancesService) {}

    // return an instance instead of doesInstanceExist and return it with the new updatedAt field???
    @Post(':group/:id')// think about different status codes for insert/update
    async createOrUpdate(@Param() params, @Body() meta: any, @Param(DoesInstanceExistPipe) doesInstanceExist: boolean) {
        const {id, group} = params
        const dateNow = Date.now()

        if (doesInstanceExist) {
            const updater = {
                ...params,
                updatedAt: dateNow,
            }
            await this.instancesService.updateTimestamp(updater)
        } else {
            const instance = {
                ...params,
                meta,
                createdAt: dateNow,
                updatedAt: dateNow,
            }

            await this.instancesService.create(instance);
        }

        return await this.instancesService.findOne(params)
    }

    @Get()
    async getGroups() {
      return await this.instancesService.getGroups();
    }

    @Get(':group')
    async getGroupInstances(@Param('group') group: string) {
      return await this.instancesService.getGroupInstances(group);
    }



    @Delete(':group/:id')
    async remove(@Param() params: IdentifyInstanceDto) {
      await this.instancesService.remove(params);
    }
}
