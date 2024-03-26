import { MongoClient } from 'mongodb'; // Assuming you're using MongoDB
import { mongo_url } from 'src/configs';


async function getCollection(collection_name) {
    try {
      const client = await MongoClient.connect(mongo_url);
      const db = client.db('catlitter'); // Assign connection to db after successful connection

      const docs = await db.collection(collection_name).find({}).toArray();
      console.log(docs)
      return docs

      client.close(); // Close the connection after use
    } catch (err) {
      console.error(err);
    }
  }

  async function getCollectionColumns(collection_name, columns) {
    try {
      const client = await MongoClient.connect(mongo_url);
      const db = client.db('catlitter');
  
      // Specify the columns to project using syntax for projected fields
      const docs = await db
        .collection(collection_name)
        .find({})
        .project(columns)
        .toArray();
  
      console.log(docs);
      await client.close(); // Ensure connection closure even with errors
      return docs;
  
    } catch (err) {
      console.error(err);
    }
  }

  async function getDocsByKeyword(collection_name, keyword) {
    try {
      // Replace with your actual MongoDB connection details
      const client = await MongoClient.connect(mongo_url);
      const db = client.db('catlitter');
  
      // Use regular expression for pattern matching (case-insensitive)
      const regex = new RegExp(keyword, 'i'); // 'i' flag for case-insensitive search
  
      // Filter invoices based on invoice_number containing the keyword
      const invoices = await db.collection(collection_name)
        .find({ invoice_number: { $regex: regex } })
        .toArray();
  
      console.log(invoices); // Log the retrieved invoices for debugging (optional)
      await client.close(); // Ensure connection closure even with errors
  
      return invoices;
  
    } catch (err) {
      console.error(err);
      return []; // Return empty array if an error occurs
    }
  }
  async  function  deleteDocument(collection_name, filter) {
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

  async  function  updateDocument(collection_name, filter, update) {
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
  async  function  insertDocument(collection_name, document) {
    try {
      const client = await MongoClient.connect(mongo_url);
      const db = client.db('catlitter');

      const currentDate = new Date();

    // Add the current date and time to the document
      document.createdAt = currentDate;
      document.updatedAt = currentDate;

      const result = await db.collection(collection_name).insertOne(document);
      console.log(`Document inserted with ID: ${result.insertedId}`);

      client.close();
    } catch (err) {
      console.error(err);
      // Handle insertion error with appropriate response (e.g., res.status(500).send('Error inserting document'))
    }
  }
  
  async  function  upsertDocument(collection_name, filter, document) {
    try {
      const client = await MongoClient.connect(mongo_url);
      const db = client.db('catlitter');

      const currentDate = new Date();

      // Add the current date and time to the document
      document.updatedAt = currentDate;

      const updateOptions = { upsert: true }; // Set upsert option
      const update = { $set: document }; // Update document fields using $set
  
      const result = await db.collection(collection_name).updateOne(filter, update, updateOptions);
  
      if (result.upsertedCount > 0) {
        console.log(`Document inserted with ID: ${result.upsertedId}`);
      } else {
        console.log(`Document updated with modified count: ${result.modifiedCount}`);
      }
  
      client.close();
    } catch (err) {
      console.error(err);
      // Handle upsert error with appropriate response
    }
  }

  async  function  getCollectionBy(collection_name,filter) {
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

  async  function  getFirstDocument(collection_name,filter) {
    try {
      const docs = await getCollectionBy(collection_name, filter)
      return docs[0]
    } catch (err) {
      console.error(err);
    }
  }

  export = {
    getCollection: getCollection, deleteDocument: deleteDocument, updateDocument:updateDocument,
    insertDocument:insertDocument,upsertDocument:upsertDocument,getCollectionBy:getCollectionBy,
    getFirstDocument: getFirstDocument, getCollectionColumns, getDocsByKeyword
  };