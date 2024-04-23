import { Document, Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Order, OrderSchema } from '../order/order.schema';

// Define the interface for the Journey document
export interface Journey extends Document {
  rider: Types.ObjectId; // Reference to the rider (user)
  orders: Types.ObjectId[]; // Array of order references
  startDate: Date; // Journey start date and time
  createdAt: Date; // Journey start date and time
  updatedAt: Date; // Journey start date and time
  status: string; // Journey status
  endDate?: Date; // Journey end date and time (optional)
}

// Define the schema for the Journey
export const JourneySchema = new mongoose.Schema<Journey>({
  rider: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the rider
    required: true,
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order', // Reference to the Order model for each order in the journey
  }],
  startDate: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, // Default value is current date and time
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now, // Default value is current date and time
  },
  status: {
    type: String,
    enum: ['cancelled', 'pending','ongoing', 'completed'], // Define possible journey status values
    default: 'pending', // Default status is 'ongoing'
  },
  endDate: {
    type: Date,
  },
});

// Create the Journey model
export const JourneyModel = mongoose.model<Journey>('Journey', JourneySchema);

export class CreateJourneyDto extends JourneyModel{
  rider_id: String;
  orders: []; // Array of order references
}