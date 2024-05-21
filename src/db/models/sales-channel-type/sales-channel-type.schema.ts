import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SalesChannelType extends Document {
  @Prop({ required: true })
  name: string;
}

export const SalesChannelTypeSchema = SchemaFactory.createForClass(SalesChannelType);
