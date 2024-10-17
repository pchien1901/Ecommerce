const cluster = require('cluster');
const os = require('os');
const express = require("express"); // import express, không dùng babel
require("dotenv").config();
const {
  notFound,
  errorHandler,
  baseErrorHandler,
} = require("./middlewares/error-handler.js");
const cors = require('cors');

// import connect db
const dbConnect = require("./config/dbconnect");

// Routes
const initRoutes = require("./routes/index.js");
const cookieParser = require("cookie-parser");



if(cluster.isMaster) {
  // Cân bằng tải cho các worker CPU
  let numCPUs = os.cpus().length; // Lấy số lượng core CPU
  if(numCPUs >= 2) {
    numCPUs = 2;
  }
  else
  {
    numCPUs = 1;
  }
  console.log(`Master ${process.pid} is running`);
  // Tạo một worker cho mỗi core CPU
  for(let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Forking a new worker...');
    cluster.fork(); // Tự động tạo lại worker mới nếu một worker bị die
  });
}
else {
  const app = express();

  // CORS
  app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'PUT', 'GET', 'DELETE']
  }))

  const port = process.env.PORT || 8888;
  app.use(express.json()); // để express đọc được data từ client là json
  app.use(express.urlencoded({ extended: true })); // để client gửi các kiểu ... thì server dùng được
  app.use(cookieParser());

  // connect DB
  dbConnect();
  initRoutes(app); // tạo routes

  app.use("/", (req, res) => {
    res.send("server on");
  });

  app.listen(port, () => {
    console.log(`Worker ${process.pid} is running on the port: ${port}`);
  });
}

