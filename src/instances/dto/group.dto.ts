import { IsString, IsInt } from 'class-validator';

export class GroupDto {
  @IsString()
  group!: string;

  @IsString()
  instances!: string;

  @IsInt()
  createdAt!: number;

  @IsInt()
  updatedAt!: number;
}
