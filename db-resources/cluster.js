const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
const seed = require("./seedScript");

function wrapCounter() {
  let counter = 0;
  return function(flag) {
    if (flag) {
      var counterOld = counter;
      counter += 25000;
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
    seed(incrementCounter(true), () => {
      worker.kill();
    });
  });

  cluster.on("disconnect", (worker, code, signal) => {
    if (incrementCounter() < 10000000) cluster.fork();
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
