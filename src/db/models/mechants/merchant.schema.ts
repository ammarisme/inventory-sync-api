import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Merchant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);
