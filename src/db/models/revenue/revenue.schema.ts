import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

enum RevenueType {
    Default = "default",
    // Add other possible revenue types here
}

@Schema()
export class Revenue extends Document {
    @Prop({ required: true })
    createdDate: Date;

    @Prop({ required: false })
    paidDate: Date;

    @Prop({ required: false })
    realizedDate: Date;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    dueAmount: number;

    @Prop()
    remark: string;

    @Prop({ default: RevenueType.Default })
    type: RevenueType;

    @Prop({ required: false })
    paidAmount: number;
}

export const RevenueSchema = new mongoose.Schema({
    createdDate: Date,
    paidDate: Date,
    realizedDate: Date,
    status: String,
    dueAmount: Number,
    remark: String,
    type: { type: String, enum: Object.values(RevenueType), default: RevenueType.Default },
    paidAmount: Number,
    // Define other properties as needed
});

export const RevenueModel = mongoose.model<Revenue>('Revenue', RevenueSchema);
