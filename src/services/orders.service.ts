import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises'; // Using promises for cleaner syntax 
import mongo = require("../services/mongo.service");
import { LineItem, OrderStatuses } from 'src/db/models/order/order.schema';

@Injectable()
export class OldOderServce {

 generateRandomNumberString(length = 5) {
    // Create an array of digits (0-9)
    const digits = '0123456789';
  
    // Use a loop to build the random string
    let result = '';
    for (let i = 0; i < length; i++) {
      result += digits[Math.floor(Math.random() * digits.length)];
    }
  
    return result;
  }
}