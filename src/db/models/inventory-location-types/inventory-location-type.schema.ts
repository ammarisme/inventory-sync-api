import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class InventoryLocationType extends Document {
  @Prop({ required: true })
  name: string;
}

export const InventoryLocationTypeSchema = SchemaFactory.createForClass(InventoryLocationType);
