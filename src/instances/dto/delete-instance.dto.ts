import { IsString } from 'class-validator';

export class DeleteInstanceDto {
    @IsString()
    id: string;

    @IsString()
    group: string;
}
