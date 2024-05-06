import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class State extends Document {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    country: string; // Link this to the country object later
}

export const StateSchema = new mongoose.Schema({
    id: String,
    name: String,
    country: String,
    // Define other properties as needed
});

export const StateModel = mongoose.model<State>('State', StateSchema);
