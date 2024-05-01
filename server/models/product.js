const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    // tên sản phẩm
    title: {
      type: String,
      required: true,
      trim: true, // tự động bỏ dấu cách
    },
    // Đường dẫn sản phẩm vd : dong-ho
    slug: {
      type: String,
      // required:true,
      unique: true,
      lowercase: true, // chuyển kí tự về chữ thường
    },
    // Mô tả chi tiết sản phẩm
    description: {
      type: String,
    },
    // Brand - nhãn hiệu
    brand: {
      type: String,
      required: true,
    },
    // price - giá
    price: {
      type: Number,
      required: true,
    },
    // category - hạng mục
    category: {
      type: mongoose.Types.ObjectId, // khóa ngoại tới bảng khác
      ref: "Category", // ref - liên kết với bảng nào
    },
    // quantity - số lượng còn
    quantity: {
      type: Number,
      default: 0,
    },
    // sold - số lượng đã bán
    sold: {
      type: Number,
      default: 0,
    },
    // images - các link ảnh
    images: {
      type: Array,
    },
    // color - màu
    color: {
      type: String,
      enum: ["Black", "Gray", "Red"],
    },
    // ratings -
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
