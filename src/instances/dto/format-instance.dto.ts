import { IsString, IsInt } from 'class-validator';

export class FormatInstanceDto {
    @IsString()
    id: string;

    @IsString()
    group: string;

    @IsInt()
    createdAt: number;

    @IsInt()
    updatedAt: number;
}
