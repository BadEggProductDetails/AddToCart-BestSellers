# Clone of Newegg Add To Cart and Best Sellers

A single component of a clone of NewEgg.com, built with a microservice architecture. The component is designed as a full stack service and includes a web server, which serves a client application and a restful api. It was deleloped on a team where each engineer contributed an app that served via proxy as a single product details page. 

# About the Project 

This repository is the result of optimizations that were made on an inherited code base in an effort to prepare the system for web level traffic. Key optimizations include server side rendering, caching of popular database requests, bundle compresssion, and containerization for deployment on kubernetes.

![](https://github.com/BadEggProductDetails/AddToCart-BestSellers/blob/master/newegg1.gif =100x)
![](https://github.com/BadEggProductDetails/AddToCart-BestSellers/blob/master/newegg2.gif)


# Technical Information

## Dependencies:
- [Node.js](https://github.com/nodejs/node) with the [Express.js](https://github.com/expressjs/express) framework
- SQLite3 with the [sqlite3 node driver](https://www.npmjs.com/package/sqlite3)
- [React](https://github.com/facebook/react) framework

## Project Overview

Data was generated for 100 items using my own functions as well as ```Faker.js``` to generate random company names and then stored in the SQLite3 database.

