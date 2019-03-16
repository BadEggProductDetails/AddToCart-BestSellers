const express = require("express");
const parser = require("body-parser");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const pgp = require("pg-promise")({
  capSQL: true // if you want all generated SQL capitalized
});

const redisClient = require("./redis-client");
const app = express();
const PORT = process.env.PORT || 3011;

//made database connection
const cn = require("../config").db;
const db = pgp(cn);

//middleware
app.use(parser.json());
app.use(cors());
app.use(compression());
app.use(morgan("dev"));

//controllers
app.get("*.js", (req, res, next) => {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  next();
});

//get styling
app.get("*.css", (req, res, next) => {
  // res.type("text/css");
  res.sendFile(path.join(__dirname + "/../client/dist/styles.css"));
});

//for benchmarking performance
app.get("/loaderio*", (req, res, next) => {
  // res.type("text/css");
  res.sendFile(
    path.join(
      __dirname + "/../server/loaderio-4b81c5e2eec8f9af6e014aa51b9d03b7.txt"
    )
  );
});

//serve up static files
app.use(express.static(path.join(__dirname + "/../client/dist")));

//query datebase for proudct info by product id
app.get("/api/items/:id", async (req, res) => {
  //test that api path exists
  //console.log(req.params.id);
  const productID = req.params.id;

  try {
    const cachedData = await redisClient.getAsync(productID);
    if (cachedData) res.send(JSON.parse(cachedData));
    else {
      const newData = await db.any(
        `select * from product p
          inner join competitors c
          on c."productID" = p."productID"
          where p."productID"=${req.params.id}
          `
      );
      await redisClient.setAsync(productID, JSON.stringify(newData));
      res.send(newData);
    }
  } catch (err) {
    console.log(err);
  }

  // db.any(
  //   `select * from product p
  //   inner join competitors c
  //   on c."productID" = p."productID"
  //   where p."productID"=${req.params.id}
  //   `
  // )
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
});

app.listen(PORT, () => {
  console.log("Server listening on port 3011!");
});
