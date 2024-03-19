const { MongoClient } = require('mongodb');
import { Injectable } from '@nestjs/common';
import * as invoicing from "./controllers/invoices";
import { generate } from 'rxjs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getOrderRuns(): any {
    return getCollection("runs");
  }

  async getOrdersOfRun(runId) {
    const run = await getItem("runs", runId);
    console.log(run[0]["transfers"]["orders"])
    return run[0]["transfers"]["orders"]
  }

  getRunTransfers(run_id): any {
    return getItem("runs", run_id)
  }

  async generateInvoice(order_id) {
    await invoicing.generateInvoice(order_id)
    return true
  }
  
}

async function getCollection(collection_name) {
  try {
    const client = await MongoClient.connect('mongodb://ec2-13-234-20-8.ap-south-1.compute.amazonaws.com:27017/');
    const db = client.db('catlitter'); // Assign connection to db after successful connection

    const docs = await db.collection(collection_name).find({}).toArray();
    client.close(); // Close the connection after use
    return docs
  } catch (err) {
    console.error(err);
  }
}

async function getItem(collection_name, id) {
  try {
    const client = await MongoClient.connect('mongodb://ec2-13-234-20-8.ap-south-1.compute.amazonaws.com:27017/');
    const db = client.db('catlitter'); // Assign connection to db after successful connection

    const docs = await db.collection(collection_name).find({run_id : id}).toArray();
    client.close(); // Close the connection after use
    return docs
  } catch (err) {
    console.error(err);
  }
}