import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstanceDocument = Instance & Document;

@Schema()
export class Instance {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  group: string;

  @Prop({ default: Date.now }) // sync the fields ?
  createdAt: number;

  @Prop({ default: Date.now })
  updatedAt: number;

  @Prop({ type: Object })
  meta: object;
}

export const InstanceSchema = SchemaFactory.createForClass(Instance);
