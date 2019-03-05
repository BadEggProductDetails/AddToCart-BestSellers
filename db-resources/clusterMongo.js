const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
const competitor = require("./createCompetitor");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";

var updateMany = function(client, competitor, counter, callback) {
  // Get the collection and bulk api artefacts
  var db = client.db("newegg");
  var collection = db.collection("products"),
    bulkUpdateOps = [];

  for (let i = counter; i < counter + 250000; i++) {
    bulkUpdateOps.push({
      updateOne: {
        filter: { _id: i },
        update: { competitors: competitor },
        upsert: true
      }
    });

    if (bulkUpdateOps.length === 1000) {
      collection.bulkWrite(bulkUpdateOps).then(function(r) {
        // do something with result
        console.log(r);
      });
      bulkUpdateOps = [];
    }
  }

  if (bulkUpdateOps.length > 0) {
    collection.bulkWrite(bulkUpdateOps).then(function(r) {
      // do something with result
      console.log(r);
    });
  }
  callback();
};

// var mongoose = require("mongoose");
// var Schema = mongoose.Schema;

// mongoose.connect("mongodb://localhost:27017/newegg", { useNewUrlParser: true });

// const db = mongoose.connection;
// mongoose.Promise = Promise;
// db.on("error", console.error.bind(console, "Connection error:"));
// db.once("open", () => {
//   console.log("Connected to db...");
// });

// mongoose.model(
//   "Product",
//   new Schema(
//     {
//       _id: Number,
//       price: Schema.Types.Decimal128,
//       onList: Number,
//       country: String,
//       originalPrice: Number,
//       savedCash: Schema.Types.Decimal128,
//       savedPcnt: Number,
//       competitors: Schema.Types.Mixed
//     },
//     { collection: "products" }
//   )
// );

// var Product = mongoose.model("Product");

function wrapCounter() {
  let counter = 1000000;
  return function(flag) {
    if (flag) {
      var counterOld = counter;
      counter += 250000;
      return counterOld;
    } else return counter;
  };
}

const incrementCounter = wrapCounter();

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("listening", (worker, address) => {
    MongoClient.connect(url, function(err, client) {
      updateMany(client, competitor(), incrementCounter(true), function() {
        client.close();
        worker.kill();
      });
    });

    // let data = {};
    // data.id = incrementCounter(true);
    // data.top = data.id + 50000;
    // data.comp = competitor();

    // Product.updateMany(
    //   { _id: { $gt: data.id, $lt: data.top } },
    //   { competitors: data.comp },
    //   { upsert: true },
    //   (err, response) => {
    //     if (err) console.log(err);
    //     else console.log("item added to " + data.top);
    //     worker.kill();
    //   }
    // );
  });

  cluster.on("disconnect", (worker, code, signal) => {
    if (incrementCounter() < 2000001) cluster.fork();
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("hello world\n");
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
