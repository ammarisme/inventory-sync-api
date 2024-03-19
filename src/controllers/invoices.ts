const {Select, Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome')
const fs = require('fs');
const axios = require('axios');
const { MongoClient } = require('mongodb');


class Sale {
  customer_mobile
  sell_note
  sku
  pay_method
  delivery_address
  first_name
  last_name
}
export async function generateInvoice(woocommerce_order_id) {
    let run_id = generateRandomNumberString()
    console.log(`run id ${run_id}`)
    var db = null // global variable to hold the connection
  
    //Get orders to be processed
    const order = await getOrder(woocommerce_order_id)
    convertToCSV(order)
  
    const driver2 = getChromeDriver(true) // go headless chrom
    // Replace these with your specific values
    const directoryPath = 'C:\\Users\\Ammar Ameerdeen\\Desktop\\stock_sync\\CAT_invoices';
    const url = 'https://app.storematepro.lk/import-sales';
    const uploadElementLocator = By.xpath('/html/body/div[3]/div[1]/section[2]/div[1]/div/div/div/form/div[1]/div/div[1]/div/input'); // Replace with actual locator
    const buttonLocator = By.xpath('/html/body/div[3]/div[1]/section[2]/div[1]/div/div/div/form/div[1]/div/div[2]/button'); // Replace with actual locator
    const finalSubmit = By.xpath('//*[@id="import_sale_form"]/div[3]/div/button'); // Replace with actual locator
    await loginStoreMate(driver2)
    const transfers = await processFiles(driver2, directoryPath, url, uploadElementLocator, buttonLocator, finalSubmit);
    try{
      // driver2.quit()
    }catch(error){
      console.log(error)
    }
    
  }


  async function loginStoreMate(driver) {
    try {
      console.log("logging in")
  
      // Step 1: Go to the login page
      await driver.get('https://app.storematepro.lk/login');
  
      // Step 2: Fill in the username field
      await driver.findElement(By.id('username')).sendKeys('NASEEF');
  
      // Step 3: Fill in the password field
      await driver.findElement(By.id('password')).sendKeys('80906');
  
      // Step 4: Click the login button
      await driver.findElement(By.className('btn btn-lg btn-primary btn-block rounded-pill')).click();
  
      // Step 5: Wait until redirected to the home page
      await driver.wait(until.urlIs('https://app.storematepro.lk/home'), 1000);
  
    } catch (error) {
      console.log(error)
    }
  }

function getChromeDriver(headeless){
  if(headeless){
    const chromeOptions = new chrome.Options()
    chromeOptions.addArguments('--headless')
    chromeOptions.addArguments("--window-size=1920,1080")
    chromeOptions.addArguments("--start-maximized")
    chromeOptions.addArguments('--download-directory="C:\\Users\\Ammar Ameerdeen\\Downloads"')
    const driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build()
    return driver
  }else{
    const chromeOptions = new chrome.Options()
    const driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build()
    return driver
  }
}

async function processFiles(driver, directoryPath, url, uploadElementLocator, buttonLocator, finalSubmit) {
  const files = fs.readdirSync(directoryPath);
  const run = {}
  run['orders'] = []
  run["source"] = "catlitter.lk"

  const total_order_qtys = {}

  try {
    for (const fileName of files) {
      console.log("processing : " + fileName)
      const order_id = fileName.split("_")[0].replace("CAT", "")
      const invoice_number = fileName.split("_")[0]
      const filePath = `${directoryPath}\\${fileName}`;
      const invoice_data = readCSV(filePath)

      // Check if it's a file (not a directory)
      if (fs.statSync(filePath).isFile()) {
        await driver.get(url);

        const uploadElement = await driver.findElement(uploadElementLocator);
        await uploadElement.sendKeys(filePath); // Simulate file upload

        const buttonElement = await driver.findElement(buttonLocator);
        await buttonElement.click();

        await driver.sleep(3000)

        const groupByDD = await driver.findElement(By.id('group_by'))
        const groupBySS = new Select(groupByDD)
        await groupBySS.selectByValue('0')


        const locationDD = await driver.findElement(By.id('location_id'))
        const locationSS = new Select(locationDD)
        await locationSS.selectByValue('330')

        const finalSubmitBtnEl = await driver.findElement(finalSubmit);
        await finalSubmitBtnEl.click()

        const elements = await driver.findElements(By.className('alert alert-danger alert-dismissible'));

        if (elements.length > 0) {
          console.log('Alert element exists');
          //record error in mongo
          await insertDocument("invoices", {
            "invoice_number": invoice_number,
            "status": "2",
            "source_order_numbe": order_id,
          })
          await createOrderNote(order_id, `Unable to auto generate invoice.`)
          await updateOrderStatus(order_id, "invoice-pending")
          run['orders'].push({
            order_id : order_id,
            status : 2,
            invoice_data : invoice_data
          })
          //Move the file to pending folder.
        } else {
          //record success in mongo
          await insertDocument("invoices", {
            "invoice_number": invoice_number,
            "status": "1",
            "source_order_numbe": order_id,
          })
          await createOrderNote(order_id, `Invoice generated - ${invoice_number}`)
          await updateOrderStatus(order_id, "processing")
          run['orders'].push({
            order_id : order_id,
            status : 1,
            invoice_number : invoice_number,
            invoice_data : invoice_data
          })
          //Move the file to a invoiced folder.
          //Change the order status to invoiced.
          //Add an order note indicating the invoice number.
        }
        //Add a record in the mongodb

        // Add wait time for processing (adjust as needed)
        //await driver.wait(until.titleContains('Success')) // or any success indicator), 10000);
      }
    }

    return run;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await driver.quit();
  }
}
function readCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const rows = fileContent.trim().split('\n')
  const header = rows[0].split(',')
  const data = rows.slice(1).map(row => row.split(','))

  const groupedData = {}

  data.forEach(row => {
    const key = row[2]

    const rowData = {}
    header.forEach((col, index) => {
      rowData[col.trim().replace(/"/g, '')] = row[index].trim().replace(/"/g, '')
    })
    groupedData[key] = rowData
  })

  // fs.unlink(filePath)
  // console.log(`File ${filePath} deleted successfully!`)

  return groupedData
}

function convertToCSV(processingOrders) {
  // Add header row
  const header = "Invoice No.,Firstname,Middlename,Lastname,Customer Phone number,Customer Email,Address Line1,Address Line 2,City,State,Product name,Product SKU,Quantity,Product Unit of measurement,Unit Price,Item Tax,Item Discount,Shipping Charges"

  // Loop through each order
  processingOrders.forEach(order => {
    // Add main header
    const csvContent = [];
    csvContent.push(header);
    // Loop through each line item
    const nosku = order.line_items.find(i => i.sku == '')
    if (nosku) {
      return
    }
    order.line_items.forEach(item => {
      // No need to extract data, just create empty cells
      csvContent.push(`CAT${order.number},${order.billing.first_name},,${order.billing.last_name}, ${order.billing.first_name},${order.billing.phone},${order.billing.email},"${order.billing.address_1}","${order.billing.address_2}","${order.billing.state}","${item.name}",${item.sku},${item.quantity},pieces,${item.price},,,${order.shipping_total}`);
    });
    const csvString = csvContent.join('\n');

    // Write CSV to file
    fs.writeFileSync(`.\\CAT_invoices\\CAT${order.number}_catlitter_lk_orders.csv`, csvString);
    console.log(`CAT${order.number}_catlitter_lk_orders.csv file created successfully!`);
  });

  return;
}


function generateRandomNumberString(length = 5) {
  // Create an array of digits (0-9)
  const digits = '0123456789';

  // Use a loop to build the random string
  let result = '';
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * digits.length)];
  }

  return result;
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
    const client = await MongoClient.connect('mongodb://localhost:27017/');
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
    const client = await MongoClient.connect('mongodb://localhost:27017/');
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
    const client = await MongoClient.connect('mongodb://localhost:27017/');
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
    const client = await MongoClient.connect('mongodb://localhost:27017/');
    const db = client.db('catlitter');

    const result = await db.collection(collection_name).insertOne(document);
    console.log(`Document inserted with ID: ${result.insertedId}`);

    client.close();
  } catch (err) {
    console.error(err);
    // Handle insertion error with appropriate response (e.g., res.status(500).send('Error inserting document'))
  }
}

function log(str){
  console.log('log: ' + str)
  }
