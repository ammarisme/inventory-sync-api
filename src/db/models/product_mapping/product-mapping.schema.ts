import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class ProductMapping extends Document {
    @Prop({ required: true })
    source_product_name: string;

    @Prop({ required: true })
    source_sku: string;

    @Prop({ required: true })
    sku: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    product_name: string;

    @Prop({ required: false })
    duplicate_sku: string;
}

export const ProductMappingSchema = new mongoose.Schema({
    source_product_name: String,
    source_sku: String,
    sku: Number,
    quantity: Number,
    product_name: String,
    duplicate_sku: String
    // Define other properties as needed
});

export const ProductMappingModel = mongoose.model<ProductMapping>('ProductMapping', ProductMappingSchema);
