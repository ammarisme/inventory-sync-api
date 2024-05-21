import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class InventoryLocation extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true, default: 'active' })
    status: string; // Assuming 'active' is the default status

    // Add other properties as needed
}

export const InventoryLocationSchema = new mongoose.Schema({
    name: String,
    address: String,
    type: String,
    status: { type: String, default: 'active' }, // Default status set to 'active'
    // Define other properties as needed
});

export const InventoryLocationModel = mongoose.model<InventoryLocation>('InventoryLocations', InventoryLocationSchema);
