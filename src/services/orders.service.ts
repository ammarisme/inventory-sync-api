import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises'; // Using promises for cleaner syntax 
import mongo = require("../services/mongo.service");

@Injectable()
export class OrdersService {

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


  async processDarazOrders(filePath: string) {
    const data = await fs.readFile(filePath, 'utf-8'); // Read file content
    const orders = this.parseDarazCsvData(data); // Parse the data based on your specific format
    let run_id = this.generateRandomNumberString() 


    await Promise.all(
      orders.map(async (order) => {
        const invoiceNumber = `DRZ${order.order_number}`;
        const invoiceData = {
            run_id : run_id,
        id : order.order_number,
          invoice_number : invoiceNumber,
          status: 4, // Assuming status 4 represents something for imported orders
          invoice_data: order, // Assuming "order" object has relevant data
        };
        await mongo.upsertDocument("invoices", { invoice_number : invoiceNumber} ,invoiceData);
      })
    );

    
    mongo.insertDocument("runs" ,  {
        run_id : run_id,
        status : 0
    })

  }

  // Replace this with your logic to parse the Daraz CSV data into an array of orders
  parseDarazCsvData(data: string): { order_number: string; line_items: any[] }[] {
    const lines = data.split('\n'); // Split data into lines
  
    // Extract header row (assuming the first line is the header)
    const headers = lines[0].split(';');
  
    // Create an empty result array to store parsed data
    const parsedData: { order_number: string; line_items: any[] }[] = [];
  
    // Loop through remaining lines (data lines)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(';');
  
      // Create an object for the current line item
      const lineItem = Object.fromEntries(
        headers.map((header, index) => [header, values[index] || '']) // Handle missing values
      );
  
      // Find the order with the matching Daraz Id
      const matchingOrder = parsedData.find((order) => order.order_number == lineItem['Order Number']);
  
      if (matchingOrder) {
        // Order already exists, push the line item to its line_items array
        parsedData.find((order) => order.order_number === lineItem['Order Number']).line_items.push(lineItem);
      } else {
        // New order, create a new entry in the parsedData array
        parsedData.push({
          order_number: lineItem['Order Number'],
          line_items: [lineItem],
        });
      }
    }
  
    return parsedData;
  }
  
}