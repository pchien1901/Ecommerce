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
  console.log("Server running on the port: ", port);
});
