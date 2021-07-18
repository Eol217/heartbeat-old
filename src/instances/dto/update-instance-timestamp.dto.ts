import {IsString, IsInt} from "class-validator";
import {IdentifyInstanceDto} from './identify-instance.dto'


export class UpdateInstanceTimestampDto extends IdentifyInstanceDto {
    @IsInt()
    updatedAt: number;
}
