// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Date, Document } from 'mongoose';

// export enum OrderStatuses {
//   order_requested = 	"order_requested",
//   order_accepted= 'order_accepted',
//   order_confirmed = 	'order_confirmed',
//   customer_cancelled=  'customer_cancelled',
//   seller_cancelled=  'seller_cancelled',

//   payment_pending = 	'payment_pending',
//   payment_failed = 	'payment_failed',
//   payment_verified = 	'payment_verified',
  
//   invoice_pending = 	'invoice_pending',
//   invoice_failed = 	'invoice_failed',
//   invoice_generated = 	'invoice_generated',
  
//   dispatched = 	'invoice_pending',
//   shipped = 	'invoice_failed',
//   shipping_denied = 	'invoice_generated',
  
//   completed = 	'completed',
  
//   return_requested = 	'return_requested',
//   return_approved = 	'return_approved',
//   return_denied = 	'return_denied',
//   return_in_progress = 	'return_in_progress',
//   return_completed = 	'return_completed',
//   refunded = 	'refunded'  // Add other order statuses as needed
// }


// // CustomerLocation Object (Represents customer location details)
// @Schema()
// export class Customer {
//   @Prop({ required: false })
//   id: string; // Customer location ID

//   @Prop({ required: false })
//   latitude?: number; // Optional latitude

//   @Prop({ required: false })
//   longitude?: number; // Optional longitude
// }

// // File Object (Represents a file linked to an order note)
// @Schema()
// export class File {
//   @Prop({ required: false })
//   url?: string; // Optional URL of the uploaded file

//   @Prop({ required: false })
//   filename?: string; // Optional filename of the uploaded file (optional, for reference)
// }

// // Order Note Object
// // @Schema()
// // export class OrderNote {
// //   @Prop({ required: false })
// //   text: string; // Order note text

// //   @Prop({ required: false })
// //   createdBy: string; // Who created the note (e.g., username, user ID)

// //   @Prop({ required: false })
// //   createdAt?: Date; // Optional creation timestamp

// //   @Prop({ required: false })
// //   file?: File; // Optional File object for a linked file
// // }

// @Schema()
// export class ReturnReason {
//   @Prop({ required: false })
//   reason_code?: string; // Optional return reason code

//   @Prop({ required: false })
//   remark?: string; // Optional return reason remark
// }

// @Schema()
// export class Dimensions {
//   @Prop({ required: false })
//   width?: number; // Optional width

//   @Prop({ required: false })
//   length?: number; // Optional length

//   @Prop({ required: false })
//   height?: number; // Optional height
// }

// // Line Item Object
// @Schema()
// export class LineItem {
//   constructor(
//     product_name: string,
//     sku: string,
//     quantity: number = 1, // Optional with default value
//     unit_of_measurement: string,
//     unit_price: number,
//     item_tax?: number, // Optional
//     item_discount?: number // Optional
//   ) {
//     this.product_name = product_name
//     this.sku = sku
//     this.quantity = quantity
//     this.unit_of_measurement = unit_of_measurement
//     this.unit_price = unit_price
//     this.item_tax = item_tax
//     this.item_discount = item_discount
//   }

//   @Prop({ required: false })
//   product_name: string;

//   @Prop({ required: false })
//   sku: string;

//   @Prop({ required: false, default: 1 })
//   quantity: number;

//   @Prop({ required: false })
//   unit_of_measurement: string;

//   @Prop({ required: false })
//   unit_price: number;

//   @Prop({ required: false })
//   item_tax?: number; // Optional item tax

//   @Prop({ required: false })
//   item_discount?: number; // Optional item discount
// }

// // Logistics Chain Object
// @Schema()
// export class LogisticsChain {

//   @Prop({ required: false })
//   warehouse?: string; // Optional courier start/end timestamp

//   @Prop({ required: false })
//   courier?: string; // Optional courier start/end timestamp

//   @Prop({ required: false })
//   type?: string; // Optional courier start/end timestamp

//   // Add other relevant logistics data fields as needed
// }

// // Selected Payment Method Object
// @Schema()
// export class SelectedPaymentMethod {
//   @Prop({ required: false })
//   method_id?: string; // Optional payment method ID

//   @Prop({ required: false })
//   remark?: string; // Optional payment method remark
// }

// // Payment Object
// @Schema()
// export class Payment {
//   @Prop({ required: false })
//   method_id?: string; // Payment method ID

//   @Prop({ required: false })
//   amount?: number; // Payment amount
// }

// // Refund Object
// @Schema()
// export class Refund {
//   @Prop({ required: false })
//   method_id?: string; // Payment method ID

//   @Prop({ required: false })
//   amount?: number; // Refund amount
// }


// @Schema()
// export class Order extends Document {

//   //General order info
//   @Prop({ required: false })
//   id: string;

//   @Prop({ required: false, unique: false })
//   invoice_number?: string;

//   @Prop({ required: false})
//   weight?: number;

//   @Prop({ required: false })
//   dimensions?: Dimensions; //wdith, length, height

//   @Prop({ required: false, default: OrderStatuses.order_confirmed })
//   status: OrderStatuses;
  
//   @Prop({ required: false })
//   line_items: LineItem[]; //Line items contain (Prouct name, SKU, Quantity, Unit of Measurement, Unit price, Item tax, item discount )

//   @Prop({ required: false })
//   order_total: number;

//   // Logistics
//   @Prop({ required: false })
//   return_reason?: ReturnReason; // Reason code, remark

//   @Prop({ required: false })
//   logistics_chain?: LogisticsChain[]; // Array of LogisticsChain objects

//   // @Prop({ required: false })
//   // estimated_completion_time?: Date;

//   @Prop({ required: false })
//   shipping_fee?: number;

//   @Prop({ required: false })
//   cod_fee?: number;

//   // Payments and Refunds
//   @Prop({ required: false })
//   selected_payment_method?: SelectedPaymentMethod; // Selected payment method object

//   @Prop({ required: false })
//   payments?: Payment[]; // Array of Payment objects

//   @Prop({ required: false })
//   refunds?: Refund[]; // Array of Refund objects

//   // Custom Fields
//   // @Prop({ required: false })
//   // custom_order_fields: any;

//   // Raw Data
//   // @Prop({ required: false })
//   // raw_data: any;

//   //customer
//   @Prop({ required: false })
//   customer: Customer;

//   // //Other
//   // @Prop({ required: false })
//   // order_notes?: OrderNote[];
// }

// export const OrderSchema = SchemaFactory.createForClass(Order);

