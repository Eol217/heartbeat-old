import { IsString } from 'class-validator';

export class IdentifyInstanceDto {
  @IsString()
  id!: string;

  @IsString()
  group!: string;
}
