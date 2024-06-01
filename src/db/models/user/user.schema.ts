import { Document } from 'mongoose';
import { Prop, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types , Schema} from 'mongoose';

export enum UserStatuses {
  active = 	"active",
  suspended= 'suspended',
  deleted = 	'deleted',
}


 export interface User extends Document {
  id: String,
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  status : String,
  is_rider : Boolean,
  is_admin : Boolean,
  is_courier : Boolean,
  source: String,
  organization: Types.ObjectId; // Reference to the rider (user)
}

export const UserSchema = new mongoose.Schema<User>({
  id: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  status: String,
  is_rider : Boolean,
  is_admin : Boolean,
  is_courier : Boolean,
  source: String,
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the rider
    required: true,
  },
});

mongoose.model('users', UserSchema  );

export class AuthenticateUser {
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  status : String;
}

export class AuthenticateUserDto {
  email: String;
  password: String;
}

export class CreateUserDto {
  id?: String;
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  status : String;
  is_rider : Boolean;
  is_admin : Boolean;
  is_courier : Boolean;
  source: String;
}