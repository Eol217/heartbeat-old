import {Controller, Get, Post, Body, Patch, Param, Delete, Res, Response} from '@nestjs/common';
import {InstancesService} from './instances.service';
import { CreateInstanceDto, UpdateInstanceTimestampDto, DeleteInstanceDto } from './dto';
import {DoesInstanceExistPipe} from "./pipes/does-instance-exist.pipe";
import _ from 'lodash'

@Controller()
export class InstancesController {
    constructor(private readonly instancesService: InstancesService) {
    }

    // return an instance instead of doesInstanceExist and return it with the new updatedAt field???
    @Post(':group/:id')// think about different status codes for insert/update
    async createOrUpdate(@Param() params, @Body() meta: any, @Param('id', DoesInstanceExistPipe) doesInstanceExist: boolean) {
        console.log('params: ', params)
        console.log('meta: ', meta)
        console.log('doesInstanceExist: ', doesInstanceExist)

        const {id, group} = params

        if (doesInstanceExist) {
            // can the identifiers be the same in different groups?
            const updater = {
                id,
                group,
                updatedAt: Date.now(),
            }
            await this.instancesService.updateTimestamp(updater)
        } else {
            const instance = {
                id,
                group,
                meta,
            }

            await this.instancesService.create(instance);
        }

        return await this.instancesService.findOne(id)
    }

    // @Get()
    // findAll() {
    //   return this.instancesService.findAll();
    // }
    //
    @Get(':group')
    findOne(@Param('group') group: string) {
      return this.instancesService.getGroupInstances(group);
    }



    @Delete(':group/:id')
    async remove(@Param() params: DeleteInstanceDto) {
      await this.instancesService.remove(params);
    }
}
