import { IsInt, IsObject } from 'class-validator';
import { IdentifyInstanceDto } from './identify-instance.dto';

export class UpdateInstanceDto extends IdentifyInstanceDto {
  @IsInt()
  updatedAt!: number;

  @IsObject()
  meta: object = {};
}
