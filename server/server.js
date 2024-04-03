const express = require("express"); // import express, không dùng babel
require("dotenv").config();

// import connect db
const dbConnect = require('./config/dbconnect')

// Routes
const initRoutes = require('./routes/index.js');

const app = express();
const port = process.env.PORT || 8888;
app.use(express.json()); // để express đọc được data từ client là json
app.use(express.urlencoded({ extended: true })); // để client gửi các kiểu ... thì server dùng được

// connect DB
dbConnect();
initRoutes(app); // tạo routes

app.use("/", (req, res) => {
  res.send("server on");
});


app.listen(port, () => {
  console.log("Server running on the port: ", port);
});
