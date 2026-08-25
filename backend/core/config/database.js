const Mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

// Read values from .env
const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
  MONGO_USER,
  MONGO_PASSWORD,
} = process.env;

// Escape username/password
const username = encodeURIComponent(MONGO_USER || "");
const password = encodeURIComponent(MONGO_PASSWORD || "");

// MongoDB URI
const MONGO_URI =
  MONGO_HOST && MONGO_PORT && MONGO_DB && MONGO_USER && MONGO_PASSWORD
    ? `mongodb://${username}:${password}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
    : "mongodb://root:datascience%40123@mongodb.docker:27017/shopdb?authSource=admin";

const dbName = MONGO_DB || "shopdb";

console.log("Mongo URI:", MONGO_URI);

// Mongoose Connection
(async () => {
  try {
    await Mongoose.connect(MONGO_URI, {
      autoIndex: false,
    });

    console.log("Successfully connected to MongoDB.");
  } catch (err) {
    console.error("Connection error:", err);
  }
})();

// Native MongoDB Connection
let myConn = async () => {
  try {
    const client = new MongoClient(MONGO_URI);

    await client.connect();

    console.log("Connected successfully to MongoDB server.");

    return client.db(dbName);

    // NOTE:
    // Do NOT close the client here.
    // The caller should close it when finished.
  } catch (err) {
    console.error("MongoClient connection error:", err);
    throw err;
  }
};

module.exports = myConn;