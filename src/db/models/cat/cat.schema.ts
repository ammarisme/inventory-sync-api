import { Document } from 'mongoose';
import * as mongoose from 'mongoose';


export interface Cat extends Document {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}

export const CatSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});

export class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}