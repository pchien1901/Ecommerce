const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    // Tên phiếu
    name:{
        type:String,
        required:true,
        unique:true,
        uppercase: true
    },
    // Giảm giá
    discount:{
        type: Number,
        required:true,
    },
    // Ngày hết hạn
    expiry:{
        type: Date,
        required:true,
        validate: {
          validator: function(value) {
            // Kiểm tra ngày hết hạn có lớn hoặc bằng ngày hiện tại không
            return value >= Date.now();
          },
          message: "Ngày hết hạn không hợp lệ."
        }
    },
}, {
  timestamps: true
});

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);