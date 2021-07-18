import {IsString, IsInt} from "class-validator";


export class UpdateInstanceTimestampDto {
    @IsString()
    id: string;

    @IsString()
    group: string;

    @IsInt()
    updatedAt: number;
}
