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

  getOrderRunsPaginated(page, per_page): any {
    return getOrderRunsPaginated("runs", {},  page*per_page , (page+1)*per_page);
  }

  getInventorySyncRunsPaginated(page, per_page): any {
    return getCollectionWithinRangeFiltered("stock_sync", {},  page*per_page , (page+1)*per_page);
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

async function getCollectionWithinRangeFiltered(collection_name, filter, from, to) {
  try {
    const client = await MongoClient.connect(mongo_url);
    const db = client.db('catlitter');

    // Use aggregation framework with $unwind and $group to correctly count orders
    const pipeline = [
      {
        $project: {
          _id: 0, // Exclude _id field (optional)
          time: { // Format updatedAt for readability
            $toString: "$updatedAt" // Convert to string first
          },
          run_id: 1,
          updated_products: 1,
          // Include other desired fields here
          
        }
      },
      // Apply skip and limit after grouping for accurate pagination
      { $skip: from },
      { $limit: to - from + 1 }
    ];

    const docs = await db.collection(collection_name).aggregate(pipeline).toArray();

    docs.forEach(doc => {
      doc.time = new Date(doc.time).toLocaleString();
    });

    client.close();
    return docs;
  } catch (err) {
    console.error('Error fetching collection within range:', err);
    throw err; // Re-throw for potential error handling in NestJS
  }
}

async function getOrderRunsPaginated(collection_name, filter, from, to) {
  try {
    const client = await MongoClient.connect(mongo_url);
    const db = client.db('catlitter');

    // Use aggregation framework with $unwind and $group to correctly count orders
    const pipeline = [
      { $match: filter },
      { $unwind: "$transfers.orders" }, // Unwind the orders array to access individual orders
      {
        $group: {
          _id: "$run_id", // Group by run_id
          
          time: { $max: "$updatedAt" }, // Get the most recent updatedAt
          successfull_orders: {
            $sum: {
              $cond: [{ $eq: ["$transfers.orders.status", 1] }, 1, 0]
            }
          },
          failed_orders: {
            $sum: {
              $cond: [{ $eq: ["$transfers.orders.status", 2] }, 1, 0]
            }
          },
        }
      },
      // Apply skip and limit after grouping for accurate pagination
      { $skip: from },
      { $limit: to - from + 1 }
    ];

    const docs = await db.collection(collection_name).aggregate(pipeline).toArray();

    docs.forEach(doc => {
      doc.time = new Date(doc.time).toLocaleString();
    });

    client.close();
    return docs;
  } catch (err) {
    console.error('Error fetching collection within range:', err);
    throw err; // Re-throw for potential error handling in NestJS
  }
}


async function getCollectionBy(collection_name,filter) {
  try {
    const client = await MongoClient.connect(mongo_url);
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
    const client = await MongoClient.connect(mongo_url);
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
    const client = await MongoClient.connect(mongo_url);
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
    const client = await MongoClient.connect(mongo_url);
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
    const client = await MongoClient.connect(mongo_url);
    const db = client.db('catlitter');

    const result = await db.collection(collection_name).insertOne(document);
    console.log(`Document inserted with ID: ${result.insertedId}`);

    client.close();
  } catch (err) {
    console.error(err);
    // Handle insertion error with appropriate response (e.g., res.status(500).send('Error inserting document'))
  }
}
