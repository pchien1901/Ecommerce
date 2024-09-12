const mongoose = require('mongoose');

const dealDailySchema = new mongoose.Schema({
    // id của sản phẩm trong dealDaily
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Liên kết tới document Product
        required: true
    },
    // Thời gian bắt đầu deal daily
    startTime: {
        type: Date,
        required: true,
    },
    // Thời gian kết thúc deal daily
    endTime: {
        type: Date,
        required: true
    },
    // Mã giảm giá áp dụng cho deal daily
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon', // liên kết tới document Coupon
        default: null // mặc định là null
    },
    // Trường đánh dấu nếu Deal daily không có thì lấy product làm Deal daily
    isRandom: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DealDaily', dealDailySchema);