import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Courier extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}

export const CourierSchema = new mongoose.Schema({
    id : String,
    name : String});


export const CourierModel = mongoose.model<Courier>('courier', CourierSchema);