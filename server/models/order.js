const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    // Sản phẩm trong đơn hàng
    products:[
      {
        // id sản phẩm
        product: { type: mongoose.Types.ObjectId, ref: "Product"},
        quantity: Number, // số lượng
        color: String, // phân loại
      }
    ],
    // trạng thái sản phẩm
    status:{
        type:String,
        default: 'Processing',
        enum: ['Cancelled', 'Processing', 'Succeeded'],
    },
    // Tổng giá của hóa đơn
    total: Number,
    coupon:  {
      type: mongoose.Types.ObjectId,
      ref: 'Coupon'
    },
    // Id người thanh toán
    orderBy:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
}, {
  timestamps: true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);