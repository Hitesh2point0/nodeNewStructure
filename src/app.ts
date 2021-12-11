//Blog to Follow when deploying : https://blog.appsignal.com/2021/02/03/improving-node-application-performance-with-clustering.html

const express = require("express");
const port = 3000;
const cluster = require("cluster");
// import * as cluster from 'cluster';
const totalCPUs = require("os").cpus().length;
import * as http from 'http';
import * as os from 'os';

// if (cluster.isMaster) {
//   console.log(`Number of CPUs is ${totalCPUs}`);
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < totalCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//     console.log("Let's fork another worker!");
//     cluster.fork();
//   });

// } else {

//   const app = express();
//   console.log(`Worker ${process.pid} started`);
//   app.get("/", (req, res) => {
//     res.send("Hello World!");
//   });

//   app.get("/api/:n", function (req, res) {
//     let n = parseInt(req.params.n);
//     let count = 0;
//     if (n > 5000000000) n = 5000000000;
//     for (let i = 0; i <= n; i++) {
//       count += i;
//     }
//     res.send(`Final count is ${count}`);
//   });

//   app.listen(port, () => {
//     console.log(`App listening on port ${port}`);
//   });

// }

 
const numberOfCores = os.cpus().length;
 
if (cluster.isMaster) {
  console.log(`Master ${process.pid} started`);
  for (let i = 0; i < numberOfCores; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} stopped working`);
    cluster.fork();
  });
  cluster.on('fork', (worker) => {
    console.log(`Worker ${worker.process.pid} started`);
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Process ${process.pid} says hello!`);
  }).listen(8000);
}