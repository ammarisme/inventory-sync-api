
const axios = require('axios');


async function getOrdersByStatus(status: string) {
    while (true) {
      try {
        const url = `https://catlitter.lk/wp-json/wc/v3/orders?status=${status}&page=1&per_page=100`;
        const headers = {
          Authorization: 'Basic Y2tfNDdjMzk3ZjNkYzY2OGMyY2UyZThlMzU4YjdkOWJlYjZkNmEzMTgwMjpjc19kZjk0MDdkOWZiZDVjYzE0NTdmMDEwNTY3ODdkMjFlMTAyZmUwMTJm',
        };
  
        const response = await axios.get(url, { headers });
        return response.data;
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

export = {
    getOrdersByStatus, createOrderNote, updateOrderStatus, getProduct
}