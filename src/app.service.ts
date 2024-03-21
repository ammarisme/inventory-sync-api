const { MongoClient } = require('mongodb');
import { Injectable } from '@nestjs/common';
import * as invoicing from "./controllers/invoices";
import { generate } from 'rxjs';
import { mongo_url } from './configs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getOrderRuns(): any {
    return getCollection("runs");
  }

  async getOrdersOfRun(runId) {
    const orders = await getCollectionBy("invoices",{run_id : runId})
    return orders
  }

  async getStockSyncRuns() {
    const orders = await getCollection("stock_sync")
    return orders
  }


  
  getRunTransfers(run_id): any {
    return getItem("runs", run_id)
  }

  async scheduleInvoiceGeneration(run_id, order_id) {
    await updateDocument("invoices", {"$and" : [{run_id : run_id}, {source_order_number:order_id }]}, {"$set":{status : 3}})
    return true
}}

async function getCollection(collection_name) {
  try {
    const client = await MongoClient.connect(mongo_url);
    const db = client.db('catlitter'); // Assign connection to db after successful connection

    const docs = await db.collection(collection_name).find({}).toArray();
    client.close(); // Close the connection after use
    return docs
  } catch (err) {
    console.error(err);
  }
}

async function getCollectionBy(collection_name,filter) {
  try {
    const client = await MongoClient.connect('mongodb://ec2-13-234-20-8.ap-south-1.compute.amazonaws.com:27017/');
    const db = client.db('catlitter'); // Assign connection to db after successful connection

    const docs = await db.collection(collection_name).find(filter).toArray();
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


async function deleteDocument(collection_name, filter) {
  try {
    const client = await MongoClient.connect('mongodb://ec2-13-234-20-8.ap-south-1.compute.amazonaws.com:27017/');
    const db = client.db('catlitter');

    const result = await db.collection(collection_name).deleteOne(filter);
    console.log(`Documents deleted: ${result.deletedCount}`);

    client.close();
  } catch (err) {
    console.error(err);
    // Handle deletion error with appropriate response (e.g., res.status(500).send('Error deleting document'))
  }
}

async function updateDocument(collection_name, filter, update) {
  try {
    const client = await MongoClient.connect('mongodb://ec2-13-234-20-8.ap-south-1.compute.amazonaws.com:27017/');
    const db = client.db('catlitter');

    const result = await db.collection(collection_name).updateOne(filter, update);
    console.log(`Documents modified: ${result.modifiedCount}`);

    client.close();
  } catch (err) {
    console.error(err);
    // Handle update error with appropriate response (e.g., res.status(500).send('Error updating document'))
  }
}

async function insertDocument(collection_name, document) {
  try {
    const client = await MongoClient.connect('mongodb://ec2-13-234-20-8.ap-south-1.compute.amazonaws.com:27017/');
    const db = client.db('catlitter');

    const result = await db.collection(collection_name).insertOne(document);
    console.log(`Document inserted with ID: ${result.insertedId}`);

    client.close();
  } catch (err) {
    console.error(err);
    // Handle insertion error with appropriate response (e.g., res.status(500).send('Error inserting document'))
  }
}
