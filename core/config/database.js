const Mongoose = require("mongoose");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
const dbName = "shopdb";
const client = new MongoClient(url);

(async () => {
  try {
    await Mongoose.connect("mongodb://localhost:27017/shopdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      autoIndex: false
    })
      .then(() => {
        console.log("Successfully connect to MongoDB.");
        //initial();
      })
      .catch((err) => {
        console.error("Connection error", err);
        //process.exit();
      });
  } catch (err) {
    console.log("error: " + err);
  }
})();

let myConn = async () => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  await client.connect();
  console.log("Connected successfully to server..........");
  const db = client.db(dbName);
  const myPromise = new Promise((resolve, reject) => {
    resolve(db);
    db.close();
  });
  return myPromise;
};

module.exports = myConn;
