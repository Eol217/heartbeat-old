import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, '0.0.0.0');
  const appUrl = await app.getUrl();

  const logger = new Logger('bootstrap');
  logger.log(`Application is running on: ${appUrl}`);
}

bootstrap();
