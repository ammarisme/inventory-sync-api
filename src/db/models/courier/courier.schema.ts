import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Courier extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  img_url: string;
}

export const CourierSchema = new mongoose.Schema({
    id : String,
    name : String,
    img_url : String,
  });


export const CourierModel = mongoose.model<Courier>('courier', CourierSchema);