import {IsInt} from "class-validator";


export class UpdateInstanceTimestampDto {
    @IsInt()
    updatedAt: number;
}
