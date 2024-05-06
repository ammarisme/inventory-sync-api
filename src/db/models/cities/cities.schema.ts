import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class City extends Document {
    @Prop({ required: true })
    id: string;
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: false })
    state: string; // link this to state object later

}

export const CitySchema = new mongoose.Schema({
    id: String,
    name: String,
    country: String,
    state: String,
    // Define other properties as needed
});

export const CityModel = mongoose.model<City>('Cities', CitySchema);
