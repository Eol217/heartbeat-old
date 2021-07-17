import { IsString } from 'class-validator';

export class CreateInstanceDto {
    @IsString()
    id: string;

    @IsString()
    group: string;
}
