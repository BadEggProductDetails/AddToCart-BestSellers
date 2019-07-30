const express = require("express");
const parser = require("body-parser");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const pgp = require("pg-promise")({
  capSQL: true // if you want all generated SQL capitalized
});

const serverBundle = require("../client/dist/bundle-server").default;
const React = require("react");
const ReactDom = require("react-dom/server");
const Layout = require("./templates/layout.js");

// const redisClient = require("./redis-client");
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

//for benchmarking performance
app.get("/loaderio*", (req, res, next) => {
  res.sendFile(
    path.join(
      __dirname + "/../server/loaderio-3932bfb07838612904f1b3891c4fd7d6.txt"
    )
  );
});

//get styling
app.get("*.css", (req, res, next) => {
  res.sendFile(path.join(__dirname + "/../client/dist/styles.css"));
});

//serve up static files
app.use(express.static(path.join(__dirname + "/../client/dist")));

//controllers
app.get("*.js", (req, res, next) => {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  next();
});

const renderComponent = (props = {}) => {
  console.log(props);
  let component = React.createElement(serverBundle, props);
  return ReactDom.renderToString(component);
};

const getData = async productID => {
  try {
    const newData = await db.any(
      `select * from product p
        inner join competitors c
        on c."productID" = p."productID"
        where p."productID"=${productID}
        `
    );
    if (newData.length > 0) return newData;
    else return;

  } catch (err) {
    console.log("QUERY: " + err);
    return err;
  }
};

app.get("/html/:id", async function(req, res) {
  let data = await getData(req.params.id);
  let props = { data: data };
  let component = renderComponent(props);
  res.end(component);
});

app.get("/app/:id", async function(req, res) {
  try {
    let data = await getData(req.params.id);
    let props = { data: data };
    let component = renderComponent(props);
    res.end(Layout(`Newegg Cart SSR`, component, props));
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//query datebase for proudct info by product id
app.get("/api/items/:id", async (req, res) => {
  try {
    const productID = req.params.id;
    let data = await getData(productID);
    res.end(JSON.stringify(data));
  } catch (err) {
    console.log(err);
    res.end();
  }

});

app.listen(PORT, () => {
  console.log("Server listening on port 3011!");
});
