import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';


export enum OrderStatuses {
  order_requested = 	"order_requested",
  order_accepted= 'order_accepted',
  order_confirmed = 	'order_confirmed',
  customer_cancelled=  'customer_cancelled',
  seller_cancelled=  'seller_cancelled',

  payment_pending = 	'payment_pending',
  payment_failed = 	'payment_failed',
  payment_verified = 	'payment_verified',
  
  invoice_pending = 	'invoice_pending',
  invoice_failed = 	'invoice_failed',
  invoice_generated = 	'invoice_generated',
  
  dispatched = 	'invoice_pending',
  shipped = 	'invoice_failed',
  shipping_denied = 	'invoice_generated',
  
  completed = 	'completed',
  
  return_requested = 	'return_requested',
  return_approved = 	'return_approved',
  return_denied = 	'return_denied',
  return_in_progress = 	'return_in_progress',
  return_completed = 	'return_completed',
  refunded = 	'refunded'  // Add other order statuses as needed
}


// CustomerLocation Object (Represents customer location details)
@Schema()
export class Customer {
  @Prop({ required: false })
  id: string; // Customer location ID

  @Prop({ required: false })
  latitude?: number; // Optional latitude

  @Prop({ required: false })
  longitude?: number; // Optional longitude
}

// File Object (Represents a file linked to an order note)
@Schema()
export class File {
  @Prop({ required: false })
  url?: string; // Optional URL of the uploaded file

  @Prop({ required: false })
  filename?: string; // Optional filename of the uploaded file (optional, for reference)
}

// Order Note Object
// @Schema()
// export class OrderNote {
//   @Prop({ required: false })
//   text: string; // Order note text

//   @Prop({ required: false })
//   createdBy: string; // Who created the note (e.g., username, user ID)

//   @Prop({ required: false })
//   createdAt?: Date; // Optional creation timestamp

//   @Prop({ required: false })
//   file?: File; // Optional File object for a linked file
// }

@Schema()
export class ReturnReason {
  @Prop({ required: false })
  reason_code?: string; // Optional return reason code

  @Prop({ required: false })
  remark?: string; // Optional return reason remark
}

const Dimensions = new mongoose.Schema({
  child: new mongoose.Schema({ 
    width: Number, // Optional width
    length: Number, // Optional length
    height: Number // Optional height
   })
});
// Line Item Object
@Schema()
export class LineItem {
  constructor(
    product_name: string,
    sku: string,
    quantity: number = 1, // Optional with default value
    unit_of_measurement: string,
    unit_price: number,
    item_tax?: number, // Optional
    item_discount?: number // Optional
  ) {
    this.product_name = product_name
    this.sku = sku
    this.quantity = quantity
    this.unit_of_measurement = unit_of_measurement
    this.unit_price = unit_price
    this.item_tax = item_tax
    this.item_discount = item_discount
  }

  @Prop({ required: false })
  product_name: string;

  @Prop({ required: false })
  sku: string;

  @Prop({ required: false, default: 1 })
  quantity: number;

  @Prop({ required: false })
  unit_of_measurement: string;

  @Prop({ required: false })
  unit_price: number;

  @Prop({ required: false })
  item_tax?: number; // Optional item tax

  @Prop({ required: false })
  item_discount?: number; // Optional item discount
}

// Logistics Chain Object
@Schema()
export class LogisticsChain {

  @Prop({ required: false })
  warehouse?: string; // Optional courier start/end timestamp

  @Prop({ required: false })
  courier?: string; // Optional courier start/end timestamp

  @Prop({ required: false })
  type?: string; // Optional courier start/end timestamp

  // Add other relevant logistics data fields as needed
}

// Selected Payment Method Object
@Schema()
export class SelectedPaymentMethod {
  @Prop({ required: false })
  method_id?: string; // Optional payment method ID

  @Prop({ required: false })
  remark?: string; // Optional payment method remark
}

// Payment Object
@Schema()
export class Payment {
  @Prop({ required: false })
  method_id?: string; // Payment method ID

  @Prop({ required: false })
  amount?: number; // Payment amount
}

// Refund Object
@Schema()
export class Refund {
  @Prop({ required: false })
  method_id?: string; // Payment method ID

  @Prop({ required: false })
  amount?: number; // Refund amount
}



 export interface Order extends Document {
  order_id: String;
  invoice_number?: String;
  tracking_number : String,
  courier_id : String,
  weight?: number;
  dimensions?: {},
  status: {};
  line_items: [];
  order_total: number;
  return_reason?: ReturnReason; // Reason code, remark
  logistics_chain?: LogisticsChain[]; // Array of LogisticsChain objects
  shipping_fee?: number;
  cod_fee?: number;
  selected_payment_method?: SelectedPaymentMethod; // Selected payment method object
  payments?: Payment[]; // Array of Payment objects
  refunds?: Refund[]; // Array of Refund objects
  customer: Customer;
}

export const OrderSchema = new mongoose.Schema({
  order_id: String,
  invoice_number: String,
  weight: Number,
  dimensions: {},
  status: String,
  line_items: [],
  order_total: Number,
  return_reason: {},
  logistics_chain: [], // Array of LogisticsChain objects
  shipping_fee: Number,
  cod_fee: Number,
  selected_payment_method: {},
  payments: [],
  refunds: [], // Array of Refund objects
  customer: {},
  tracking_number : String,
  courier_id : String,
});

mongoose.model('orders', OrderSchema  );

export class CreateOrderDto {
  order_id: String;
  invoice_number: String;
  weight: Number;
  dimensions: {};
  status: String;
  line_items: [];
  order_total: Number;
  return_reason: {};
  logistics_chain: [];
  shipping_fee: Number;
  cod_fee: Number;
  selected_payment_method: {};
  payments: []; // Array of Payment objects
  refunds: []; // Array of Refund objects
  customer: {};
}

export class UpdateOrderStatusDto {
  order_id: String;
  status: String;
}

export class UpdateTrackingDto {
  order_id: String;
  courier_id: String;
  tracking_number: String;
}