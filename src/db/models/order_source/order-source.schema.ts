import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class OrderSource extends Document {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  type: string;
  @Prop({ required: false })
  image_url: string;
}

export const OrderSourceSchema = new mongoose.Schema({
    id : String,
    name : String});


export const OrderSourceModel = mongoose.model<OrderSource>('order_source', OrderSourceSchema);
