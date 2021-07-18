import { IsString, IsObject } from 'class-validator';
import { IdentifyInstanceDto } from './identify-instance.dto'
import {Instance, InstanceSchema} from "../schemas/instance.schema";

export class CreateInstanceDto extends Instance {}
