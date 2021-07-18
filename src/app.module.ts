import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {LoggerMiddleware} from './common/middleware/logger.middleware';
import { InstancesModule } from './instances/instances.module';
import {InstancesController} from "./instances/instances.controller";

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        InstancesModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes(InstancesController);
    }
}
