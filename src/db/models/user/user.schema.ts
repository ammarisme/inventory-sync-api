import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';


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
}

export const UserSchema = new mongoose.Schema({
  id: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  status: String,
  is_rider : Boolean,
  is_admin : Boolean,
  is_courier : Boolean,
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
}