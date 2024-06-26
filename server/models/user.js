const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require('crypto');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    // Tên
    firstName:{
        type:String,
        required:true,
    },
    // Họ
    lastName:{
      type:String,
      required:true,
    },
    // Email
    email:{
        type:String,
        required:true,
        unique:true,
    },
    // Số điện thoại
    mobile:{
        type:String,
        required:true,
        unique:false,
    },
    // Mật khẩu
    password:{
        type:String,
        required:true,
    },
    // Quyền người dùng - mặc định user
    role:{
      type:String,
      enum: ['user', 'admin'], // quyền chỉ có thể là user hoặc admin
      default: 'user',
    },
    // Giỏ hàng
    cart:[{
      product: { type: mongoose.Types.ObjectId, ref: "Product" }, // id của mặt hàng
      quantity: Number, // số lượng
      color: String,
    }],
    // Địa chỉ
    address: {
      type: Array,
      default: []
    },
    // Bài viết yêu thích
    wishList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product"
      }
    ],
    // Có bị chặn không
    isBlocked: {
      type: Boolean,
      default: false
    },
    // RefreshToken
    refreshToken: {
      type: String,
    },
    // lưu thời gian thay đổi mật khẩu
    passwordChangedAt: {
      type: String
    },
    // reset token để đặt lại mật khẩu
    passwordResetToken: {
      type: String
    },
    // thời gian hết hạn reset token
    passwordResetExpires: {
      type: String
    }
}, {
  // chỉnh thời gian về kiểu timestamps
  timestamps: true,
});

/**
 * Xử lí trước khi ghi vào db, chỉ khi 'save' mới thực hiện(trigger) hàm
 * Thực hiện hash password bằng bscrypt
 */
userSchema.pre('save', async function(next) {
  // Nếu đã thay đổi password - không phải đăng ký
  if(!this.isModified('password')) {
    next(); // tiếp tục chạy hàm dưới
  }
  // tạo muối
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Các hàm dùng cho schema
 */
userSchema.methods = {
  /**
   * Kiểm tra mật khẩu có chính xác không
   * @param {string} password Mật khẩu người dùng nhập vào
   * @returns true - Mật khẩu đúng, false - mật khẩu sai
   * Author: 
   */
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },

  /**
   * Tạo resetToken và mã hóa bằng sha256 rồi lưu vào DB
   * @returns resetToken được tạo (chưa mã hóa)
   * Author:
   */
  createPasswordChangedToken: function () {
     const resetToken = crypto.randomBytes(32).toString('hex'); // hệ hexan
     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
     this.passwordResetExpires = Date.now() + 15*60*1000; // thời gian hết hạn reset password token là 15 phút
     return resetToken;
  }
}

//Export the model
module.exports = mongoose.model('User', userSchema);