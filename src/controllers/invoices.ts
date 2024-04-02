import { woocommerce_url } from "src/configs.js";
import utils = require("../common/util.js");
import mongo = require("../services/mongo.service.js");

const fs = require('fs');
const axios = require('axios');
const { MongoClient } = require('mongodb');


export async function generateInvoice(woocommerce_order_id) {
  try {
    var db = null // global variable to hold the connection
    const order = await getOrder(woocommerce_order_id)

    mongo.updateDocument("invoices", {order_id : woocommerce_order_id}, {status: 3})
    // Change the order status in the mongodb
  } catch (error) {
    utils.log(error)
  }
}


async function getOrder(woocommerce_order_id) {
  while (true) {
    try {
      const url = `${woocommerce_url}/wp-json/wc/v3/orders/${woocommerce_order_id}`;
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
  const apiUrl = `${woocommerce_url}/wp-json/wc/v3/orders/${order_id}/notes`;
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
  const apiUrl = `${woocommerce_url}/wp-json/wc/v3/orders/${order_id}`;
  const data = {
       status
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
    const url = `${woocommerce_url}/wp-json/wc/v3/products/` + id;
    const headers = {
      Authorization: 'Basic Y2tfNDdjMzk3ZjNkYzY2OGMyY2UyZThlMzU4YjdkOWJlYjZkNmEzMTgwMjpjc19kZjk0MDdkOWZiZDVjYzE0NTdmMDEwNTY3ODdkMjFlMTAyZmUwMTJm',
    };

    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to call API: ${error.message}`);
  }
}