import { PipeTransform, Injectable } from '@nestjs/common';
import { InstancesService } from '../instances.service';
import { IdentifyInstanceDto } from '../dto';

@Injectable()
export class DoesInstanceExistPipe
  implements PipeTransform<IdentifyInstanceDto>
{
  constructor(private readonly instancesService: InstancesService) {}

  async transform(params: IdentifyInstanceDto): Promise<boolean> {
    const existingInstance = await this.instancesService.findOne(params);

    return Boolean(existingInstance);
  }
}
