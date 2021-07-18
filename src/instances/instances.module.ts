import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Instance, InstanceSchema} from "./schemas/instance.schema";

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Instance.name, schema: InstanceSchema }]),
  ],
  controllers: [InstancesController],
  providers: [InstancesService]
})
export class InstancesModule {}
