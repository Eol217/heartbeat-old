import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('Request url: ' + req.url);
    this.logger.log('Request method: ' + req.method);
    this.logger.log('Request body: ', req.body);
    next();
  }
}
