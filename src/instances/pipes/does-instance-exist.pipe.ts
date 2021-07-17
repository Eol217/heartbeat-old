import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import {InstancesService} from "../instances.service";

@Injectable()
export class DoesInstanceExistPipe implements PipeTransform<string> {
  constructor(private readonly instancesService: InstancesService) {}

  async transform(id: string, metadata: ArgumentMetadata): Promise<boolean> {
    const existingInstance = await this.instancesService.findOne(id)

    return Boolean(existingInstance)
  }
}
