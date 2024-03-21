import { mongo_url } from "src/configs";

const fs = require('fs');
const axios = require('axios');
const { MongoClient } = require('mongodb');

export async function generateInvoice(woocommerce_order_id) {
  try {
    var db = null // global variable to hold the connection
    const order = await getOrder(woocommerce_order_id)

    updateDocument("invoices", {order_id : woocommerce_order_id}, {status: 3})
    // Change the order status in the mongodb
  } catch (error) {
    log(error)
  }
}


async function getOrder(woocommerce_order_id) {
  while (true) {
    try {
      const url = `https://catlitter.lk/wp-json/wc/v3/orders/${woocommerce_order_id}`;
      const headers = {
        Authorization: 'Basic Y2tfNDdjMzk3ZjNkYzY2OGMyY2UyZThlMzU4YjdkOWJlYjZkNmEzMTgwMjpjc19kZjk0MDdkOWZiZDVjYzE0NTdmMDEwNTY3ODdkMjFlMTAyZmUwMTJm',
      };

      const response = await axios.get(url, { headers });
      return [response.data];
    } catch (error) {
      throw new Error(`Failed to call API: ${error.message}`);
    }
  }
}

async function createOrderNote(order_id, note) {
  // Call the PUT API to update the stock quantity
  const apiUrl = `https://catlitter.lk/wp-json/wc/v3/orders/${order_id}/notes`;
  const data = {
    note: note,
    author: "system",
    customer_note: false
  }

  try {
    const postResponse = await axios.post(apiUrl, data, {
      headers: {
        Authorization: 'Basic Y2tfNDdjMzk3ZjNkYzY2OGMyY2UyZThlMzU4YjdkOWJlYjZkNmEzMTgwMjpjc19kZjk0MDdkOWZiZDVjYzE0NTdmMDEwNTY3ODdkMjFlMTAyZmUwMTJm',  // Replace 'asd' with your actual authorization code
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(`Failed to create note: ${order_id}`, error);
  }
}

async function updateOrderStatus(order_id, status) {
  // Call the PUT API to update the stock quantity
  const apiUrl = `https://catlitter.lk/wp-json/wc/v3/orders/${order_id}`;
  const data = {
    status: status
  }

  try {
    const putReponse = await axios.post(apiUrl, data, {
      headers: {
        Authorization: 'Basic Y2tfNDdjMzk3ZjNkYzY2OGMyY2UyZThlMzU4YjdkOWJlYjZkNmEzMTgwMjpjc19kZjk0MDdkOWZiZDVjYzE0NTdmMDEwNTY3ODdkMjFlMTAyZmUwMTJm',  // Replace 'asd' with your actual authorization code
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(`Failed to create note: ${order_id}`, error);
  }
}

async function getProduct(id) {
  try {
    const url = 'https://catlitter.lk/wp-json/wc/v3/products/' + id;
    const headers = {
      Authorization: 'Basic Y2tfNDdjMzk3ZjNkYzY2OGMyY2UyZThlMzU4YjdkOWJlYjZkNmEzMTgwMjpjc19kZjk0MDdkOWZiZDVjYzE0NTdmMDEwNTY3ODdkMjFlMTAyZmUwMTJm',
    };

    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to call API: ${error.message}`);
  }
}

async function getCollection(collection_name) {
  try {
    const client = await MongoClient.connect(mongo_url);
    const db = client.db('catlitter'); // Assign connection to db after successful connection

    const docs = await db.collection(collection_name).find({}).toArray();
    console.log(docs)

    client.close(); // Close the connection after use
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

function log(str) {
  console.log('log: ' + str)
}
