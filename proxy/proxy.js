const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const port = 8080;
const axios = require("axios");
const parser = require("body-parser");
const url = require("../config");

app.use(parser.json());

app.use(morgan("dev"));
//app.use(express.static(path.join(__dirname, '../client/dist')));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html")); //serve index file
});

app.get("/:id", (req, res) => {
  axios
    .get(`${url.url}/api/items/${req.params.id}`)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Proxy running at: http://localhost:${port}`);
});
