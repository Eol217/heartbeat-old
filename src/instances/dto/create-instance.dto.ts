import { IsString, IsObject } from 'class-validator';

export class CreateInstanceDto {
    @IsString()
    id: string;

    @IsString()
    group: string;

    @IsObject()
    meta: object;
}
