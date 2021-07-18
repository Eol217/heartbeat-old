import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Instance, InstanceSchema } from './schemas/instance.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Instance.name, schema: InstanceSchema },
    ]),
  ],
  controllers: [InstancesController],
  providers: [InstancesService],
})
export class InstancesModule {}
