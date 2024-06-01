import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Organization extends Document {
    @Prop({ required: true })
    id: string;
    
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    city: string; // link this to city object later

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    website: string;

    @Prop({ required: false })
    phone: string;

    @Prop({ required: false })
    email: string;

    @Prop({ required: false })
    woocommerceKey: string;
    
    @Prop({ required: false })
    woocommerceSecret: string;

    // Define other properties as needed
}

export const OrganizationSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    city: String,
    country: String,
    website: String,
    phone: String,
    email: String,
    woocommerceKey: String,
    woocommerceSecret: String
    // Define other properties as needed
});

export const OrganizationModel = mongoose.model<Organization>('Organizations', OrganizationSchema);
