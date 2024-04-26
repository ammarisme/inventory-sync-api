import { Document, Schema } from 'mongoose';
import * as mongoose from 'mongoose';

// Define the interface for the Customer document
export interface Customer extends Document {
  customer_id: string; // Customer location ID
  latitude?: number; // Optional latitude
  longitude?: number; // Optional longitude

  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
 
  createdAt: Date; // Customer start date and time
  updatedAt: Date; // Customer start date and time
  status: string; // Customer status
  pin: {};
}

// Define the schema for the Customer
export const CustomerSchema = new mongoose.Schema<Customer>({
  customer_id: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  address1: {
    type: String,
    required: false,
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], // Define possible customer status values
    default: 'active', // Default status is 'active'
  },
  pin: {}
});

export class CreateCustomerDto{
  customer_id: string;
  latitude?: number;
  longitude?: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address1: string;
  address2?: string;
  city?: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerPinDto {
  readonly customer_id: string;
  readonly placeId?: string | null;
  readonly formattedAddress?: string | null;
  readonly location: LocationDto;

  constructor(data: CustomerPinDto) {
    this.customer_id = data.customer_id;
    this.placeId = data.placeId || null;
    this.formattedAddress = data.formattedAddress || null;
    this.location = new LocationDto(data.location);
  }
}

export class LocationDto {
  readonly lat: number;
  readonly lng: number;
  readonly locationType?: string | null;
  readonly addressComponents: AddressComponentDto[];

  constructor(data: LocationDto) {
    this.lat = data.lat;
    this.lng = data.lng;
    this.locationType = data.locationType || null;
    this.addressComponents = data.addressComponents.map(
      (component) => new AddressComponentDto(component)
    );
  }
}

export class AddressComponentDto {
  readonly shortName: string;
  readonly longName: string;
  readonly types: string[];

  constructor(data: AddressComponentDto) {
    this.shortName = data.shortName;
    this.longName = data.longName;
    this.types = [...data.types];
  }
}

// Create the Customer model
export const CustomerModel = mongoose.model<Customer>('Customer', CustomerSchema);