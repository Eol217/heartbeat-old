import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {InstancesService} from './instances.service';
import {CreateInstanceDto} from './dto/create-instance.dto';
import {UpdateInstanceTimestampDto} from './dto/update-instance-timestamp.dto';
import {DoesInstanceExistPipe} from "./pipes/does-instance-exist.pipe";

@Controller()
export class InstancesController {
    constructor(private readonly instancesService: InstancesService) {
    }

    @Post(':group/:id')
    async createOrUpdate(@Param() params, @Body() meta: any, @Param('id', DoesInstanceExistPipe) doesInstanceExist: boolean) {
        console.log('params: ', params)
        console.log('meta: ', meta)
        console.log('doesInstanceExist: ', doesInstanceExist)

        const {id, group} = params

        if (doesInstanceExist) {
            await this.instancesService.updateTimestamp(id, Date.now())
        } else {
            const instance = {
                id,
                group,
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
    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.instancesService.findOne(+id);
    // }
    //
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateInstanceDto: UpdateInstanceDto) {
    //   return this.instancesService.update(+id, updateInstanceDto);
    // }
    //
    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.instancesService.remove(+id);
    // }
}
