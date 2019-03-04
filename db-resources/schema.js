// const path = require("path");
// const sqlite3 = require("sqlite3").verbose();
const { Pool, Client } = require("pg");
// const connectionString =
//   process.env.DATABASE_URL || "postgres://sjm:sjm2358!@localhost:5432/newegg";
// const pool = new Pool(connectionString);
const pool = new Pool({
  user: "sjm",
  host: "localhost",
  password: "sjm2358!",
  port: 5432,
  database: "dummy"
});

const query1 = `CREATE TABLE product (
    "productID" integer primary key,
    "priceProduct" decimal,
    "onList" integer,
    "country" text,
    "originalPrice" decimal,
    "savedCash" decimal,
    "savedPcnt" integer
  )`;

const query2 = `CREATE TABLE competitors (
            "numReviews" integer,
            "deliveryPcnt" decimal,
            "productPcnt" decimal,
            "servicePcnt" decimal,
            "reviewScore" integer,
            "country" text,
            "companyName" text,
            "price" decimal,
            "productID" integer,
            CONSTRAINT fk_product
            FOREIGN KEY ("productID")
            REFERENCES product("productID")
            )`;

(async () => {
  const res1 = await pool.query(query1);
  console.log(res1);
  const res2 = await pool.query(query2);
  console.log(res2);
  await pool.end();
})();

// pool
//   .query(query1)
//   .then(res => {
//     console.log(res);
//     pool
//       .query(query2)
//       .then(res => {
//         console.log(res);
//         pool.end();
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   })
//   .catch(err => {
//     console.log(err);
//   });

// client
//   .query(
//     `create table product (
//   productID integer primary key,
//   priceProduct integer,
//   onList integer,
//   country text,
//   originalPrice integer,
//   savedCash integer,
//   savedPcnt text
// )`
//   )
//   .then(res => console.log(res))
//   .catch(e => console.error(e.stack));

// client
//   .query(
//     `create table competitors (
//           numReviews integer,
//           deliveryPcnt integer,
//           productPcnt integer,
//           servicePcnt integer,
//           reviewScore integer,
//           country text,
//           companyName text,
//           price integer,
//           productID integer,
//           CONSTRAINT fk_product
//           FOREIGN KEY (productID)
//           REFERENCES product(productID)
//           )`
//   )
//   .then(res => console.log(res))
//   .catch(e => console.error(e.stack));

// var db = new sqlite3.Database(path.join(__dirname, "./addToCart.db"));

// // db.serialize(function() {
// //   db.run(`create table product (
// //     productID integer primary key,
// //     priceProduct integer,
// //     onList integer,
// //     country text,
// //     originalPrice integer,
// //     savedCash integer,
// //     savedPcnt text
// //   )`);

// //   db.run(`create table competitors (
// //     numReviews integer,
// //     deliveryPcnt integer,
// //     productPcnt integer,
// //     servicePcnt integer,
// //     reviewScore integer,
// //     country text,
// //     companyName text,
// //     price integer,
// //     productID integer,
// //     CONSTRAINT fk_product
// //     FOREIGN KEY (productID)
// //     REFERENCES product(productID)
// //     )`);
// // });
