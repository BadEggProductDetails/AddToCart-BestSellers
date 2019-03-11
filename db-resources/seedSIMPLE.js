const faker = require("faker");
// const { Pool, Client } = require("pg");
// const pool = new Pool({
//   user: "sjm",
//   host: "localhost",
//   password: "sjm2358!",
//   port: 5432,
//   database: "newegg"
// });
const fs = require("fs");

const pgp = require("pg-promise")({
  capSQL: true // if you want all generated SQL capitalized
});

const db = pgp({
  user: "sjm",
  host: "localhost",
  password: "sjm2358!",
  port: 5432,
  database: "newegg"
});

let productStore = {};

let competitorStore = {};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomArbitrary(min, max) {
  let x = Math.round(Math.random() * (max - min) + min);
  let y = Math.round(Math.random() * (max - min) + min) / 100;
  return x + y;
}

function getRandomWhole(min, max) {
  let x = Math.round(Math.random() * (max - min) + min);
  return x;
}

function scoreRound(num) {
  return Math.ceil(num * 100) / 100;
}

function getRandomPcnt(min, max) {
  let x = Math.round(Math.random() * (max - min) + min);
  return 1 + x / 100;
}

function generateRandomCountry(min, max) {
  let x = Math.round(Math.random() * (max - min) + min);
  var countries = ["United States", "Mexico", "Canada", "China"];
  return countries[x];
}

function generateEntries() {
  //generate entries
  for (var i = 0; i < 500; i++) {
    /*********
        PRODUCT
        ********** */
    let product = {};
    // //store product id
    product.productID = i;
    // generate product price, (60-220)
    product.priceProduct = getRandomArbitrary(60, 220);
    //generate on lists, (3-20)
    product.onList = getRandomWhole(3, 20);
    //generate country (canada, mexico, US)
    product.country = generateRandomCountry(0, 3);
    //generate original price
    let multiplier = getRandomPcnt(1, 25);
    let multipliedPrice = product.priceProduct * multiplier;
    product.originalPrice = Math.round(multipliedPrice * 100) / 100;
    //generate the saved cash
    let total = product.originalPrice - product.priceProduct;
    product.savedCash = Math.round(total * 100) / 100;
    //generate saved pcnt
    product.savedPcnt = Math.round((multiplier - 1) * 100);

    productStore[i] = product;

    let competitor = {};
    //store product id
    competitor.productID = i;
    //generate # of reviews (10-1200)
    competitor.numReviews = getRandomWhole(8, 1200);
    //generate delivery % (50-97)
    competitor.deliveryPcnt = getRandomArbitrary(50, 97);
    //product % (50-97)
    competitor.productPcnt = getRandomArbitrary(50, 97);
    //customer service % (50-97)
    competitor.servicePcnt = getRandomArbitrary(50, 97);
    //review score (delivery%+product%+service%)/3
    competitor.reviewScore = Math.round(
      (competitor.deliveryPcnt +
        competitor.productPcnt +
        competitor.servicePcnt) /
        3
    );
    //generate country (canada, mexico, US)
    competitor.country = faker.address.country();
    //console.log(competitor.country);
    //generate random company name
    competitor.companyName = faker.company.companyName();
    //generate price
    let percent = getRandomPcnt(1, 15);
    competitor.price = scoreRound(product.priceProduct * percent);
    competitorStore[i] = competitor;
  }
}

function seed(start, cb) {
  generateEntries();
  console.log("Seeding start: " + start);

  let products = [];
  let competitors = [];

  for (var i = start; i < start + 5; i++) {
    let id = getRandomInt(500);
    productStore[id].productID = i;
    products.push(productStore[id]);

    for (var j = 0; j < 3; j++) {
      let id = getRandomInt(500);
      competitorStore[id].productID = i;
      competitors.push(competitorStore[id]);
    }
  }

  let productsSchema = [
    "productID",
    "priceProduct",
    "onList",
    "country",
    "originalPrice",
    "savedCash",
    "savedPcnt"
  ];

  let competitorsSchema = [
    "productID",
    "numReviews",
    "deliveryPcnt",
    "productPcnt",
    "servicePcnt",
    "reviewScore",
    "country",
    "companyName",
    "price"
  ];

  (async () => {
    let queryProduct = pgp.helpers.insert(products, productsSchema, "product");
    let queryCompetitors = pgp.helpers.insert(
      competitors,
      competitorsSchema,
      "competitors"
    );
    try {
      console.log(queryProduct);
      let res = await db.none(queryProduct);
      let res2 = await db.none(queryCompetitors);
    } catch (error) {
      console.log(`Failed: ` + start + ` - ` + (start + 5000));
      console.log(error);
      if (cb) cb();
    }
    console.log(`Completed: ` + (start + 5000));
    if (cb) cb();

    // if (end < 10000000) chunk(start + 250000, end + 250000);
  })();
}

seed(7);

module.exports = seed;
