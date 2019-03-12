const express = require("express");
const app = express();
const cluster = require("cluster");
const parser = require("body-parser");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const pgp = require("pg-promise")({
  capSQL: true // if you want all generated SQL capitalized
});

if (cluster.isMaster) {
  //Create cluster for number of cpus available
  for (var i = 0; i < 2; i++) {
    cluster.fork();
  }
  // Listen for dying workers
  cluster.on("exit", function(worker) {
    // Replace the dead worker
    console.log("Worker %d died :(", worker.id);
    cluster.fork();
  });
} else {
  //For rest of clusters run express server
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

  app.get("/loaderio*", (req, res, next) => {
    // res.type("text/css");
    res.sendFile(
      path.join(
        __dirname + "/../server/loaderio-94caf22b6eb724162c661502c0c5f709.txt"
      )
    );
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
}

/*

  select * from competitors
  inner join product
  on competitors.productID = product.productID
  where product.productID=5

*/
