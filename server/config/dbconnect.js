const { default: mongoose } = require("mongoose");

/**
 * Hàm connect database - mongodb
 * Author: PMChien (02/04/2024)
 */
const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);

    if (connect.connection.readyState === 1) {
      console.log("DB connection is successfully");
    } else {
      console.log("DB connecttion false");
    }
  } catch (error) {
    console.error("Đã có lối khi kết nối Mongodb: ", error);
    throw new Error("Lỗi: ", error);
  }
};

module.exports = dbConnect;
