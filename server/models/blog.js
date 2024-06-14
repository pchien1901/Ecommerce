const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
  // Tiêu đề
  title: {
    type: String,
    required: true,
  },
  // Mô tả bài đăng
  description: {
    type: String,
    required: true,
  },
  // Danh mục bài đăng
  category: {
    type: String,
    required: true,
  },
  // Số lượt xem
  numberViews: {
    type: Number,
    default: 0,
  },
  // Đánh dấu đã thích bài viết chưa
  isLiked: {
    type: Boolean,
    default: false,
  },
  // đánh dấu đã dislike bài viết chưa
  isDisliked: {
    type: Boolean,
    default: false,
  },
  // danh sách id người like bài viết
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  // danh sách id người dislike bài viết
  dislikes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  // Ảnh trong bài viết
  image: {
    type: String,
    default:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.one.com%2Fen%2Fonline-marketing%2Fwhat-is-a-blog&psig=AOvVaw3sdcBj9iaq97iw6FaI4A0U&ust=1714787395742000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKj5qvuu8IUDFQAAAAAdAAAAABAN",
  },
  // Tác giả bài viết
  author: {
    type: String,
    default: "Admin",
  },
}, {
  timestamps: true,
  // chỉ chạy khi chạy res.status.json 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true}
});

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
