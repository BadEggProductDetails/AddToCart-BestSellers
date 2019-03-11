const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database("../addToCart.db");
const parser = require("body-parser");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const pgp = require("pg-promise")({
  capSQL: true // if you want all generated SQL capitalized
});
const cn = require("../config").db;

const db = pgp(cn);

app.use(parser.json());
app.use(cors());
app.use(compression());
app.use(morgan("dev"));

app.get("*.js", (req, res, next) => {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  next();
});

app.get("*.css", (req, res, next) => {
  // res.type("text/css");
  res.sendFile(path.join(__dirname + "/../client/dist/styles.css"));
});

app.use(express.static(path.join(__dirname + "/../client/dist")));

app.get("/api/items/:id", (req, res) => {
  //test that api path exists
  //console.log(req.params.id);
  db.any(
    `select * from product p
    inner join competitors c
    on c."productID" = p."productID"
    where p."productID"=${req.params.id}
    `
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3011, () => {
  console.log("Server listening on port 3011!");
});

/*

  select * from competitors
  inner join product
  on competitors.productID = product.productID
  where product.productID=5

*/
