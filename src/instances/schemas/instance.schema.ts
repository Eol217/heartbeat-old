import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Instance {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  group!: string;

  @Prop({ required: true })
  createdAt!: number;

  @Prop({ required: true })
  updatedAt!: number;

  @Prop({ type: Object })
  meta: object = {};
}

export type InstanceDocument = Instance & Document;

export const InstanceSchema = SchemaFactory.createForClass(Instance);
