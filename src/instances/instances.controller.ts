import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { InstancesService } from './instances.service';
import { IdentifyInstanceDto } from './dto';
import { DoesInstanceExistPipe } from './pipes/does-instance-exist.pipe';
import { Response } from 'express';

@Controller()
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Post(':group/:id')
  async createOrUpdate(
    @Param() params: IdentifyInstanceDto,
    @Body() meta: object,
    @Param(DoesInstanceExistPipe) doesInstanceExist: boolean,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dateNow = Date.now();
    let status = HttpStatus.CREATED;

    if (doesInstanceExist) {
      const updater = {
        ...params,
        meta,
        updatedAt: dateNow,
      };
      await this.instancesService.updateTimestamp(updater);
      status = HttpStatus.OK;
    } else {
      const instance = {
        ...params,
        meta,
        createdAt: dateNow,
        updatedAt: dateNow,
      };

      await this.instancesService.create(instance);
    }

    res.status(status);

    return await this.instancesService.findOne(params);
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
