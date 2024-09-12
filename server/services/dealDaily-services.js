const DealDaily = require('../models/dealDaily.js');
const Coupon = require('../models/coupon.js');
const Product = require('../models/product.js');
const BaseError =  require('../exception/base-error.js');
const { isValidObjectId } = require('../ultis/helper.js');
const { default: mongoose } = require('mongoose');

/**
 * Hàm tạo mới một deal daily 
 * @param {mongoose.Schema.Types.ObjectId} productId id của sản phẩm thêm vào deal daily
 * @param {*} startTime Thời gian bắt đầu deal daily mặc định là thời điểm bắt đầu chạy hàm
 * @param {*} endTime Thời gian kết thúc deal daily
 * @param {*} couponName Tên mã giảm giá
 * @param {*} discount tỉ lệ giảm giá (%)
 * @returns {object} {
 *      success: true - thành công/false,
 *      code: 201/500,
 *      devMsg: thông báo dev,
 *      userMsg: thông báo user,
 *      data: deal daily || null
 * }
 * @author PMChien (12/09/2024)
 */
const createDealDaily = async (productId, startTime, endTime, couponName = '', discount = 0) => {
    if(!isValidObjectId(productId)) {
        throw new BaseError(
            false,
            400, 
            "productId không hợp lệ.",
            "Thông tin sản phẩm không hợp lệ."
        );
    }

    let product = await Product.findById(productId);
    if(!product) {
        throw new BaseError(
            false,
            400, 
            "không tìm thấy product theo productId.",
            "Thông tin sản phẩm không hợp lệ hoặc sản phẩm không tồn tại."
        );
    }

    if(!startTime) {
        startTime = new Date();
    }

    let dealDaily = await DealDaily.create({productId: productId, startTime: startTime, endTime: endTime });

    if(couponName !== '' && discount !== 0 ) {
        // Kiểm tra tên mã giảm giá có bị trùng không
        let existCoupon = await Coupon.find({ name: couponName });
        if (existCoupon.length !== 0) {
            throw new BaseError(
                false,
                400,
                "Mã coupon đã tồn tại trong DB.",
                "Mã giảm giá đã tồn tại."
            );
        }
        let coupon = await Coupon.create({ name: couponName, discount: discount, expiry: endTime });
        dealDaily.couponId = coupon._id;
        await dealDaily.save();
    }
    return {
        success: dealDaily ? true : false,
        code: dealDaily ? 201 : 500,
        devMsg: dealDaily ? '' : 'Có lỗi khi tạo deal daily.',
        userMsg: dealDaily ? 'Thêm mới deal daily thành công.' : 'Chưa thể tạo mới deal daily.',
        data: dealDaily
    }
}

/**
 * Lấy deal daily theo id
 * @param {mongoose.Schema.Types.ObjectId} id id của deal daily
 * @returns {object} {
 *      success: true - thành công/false,
 *      code: 200/404,
 *      devMsg: '',
 *      userMsg: '',
 *      data: dealDaily || null
 * }
 * @author PMChien (12/09/2024)
 */
const getDealDailyById = async (id) => {
    let dealDaily = await DealDaily.findById(id).populate('productId').populate('couponId');
    return {
        success: dealDaily ? true : false,
        code: dealDaily ? 200 : 404,
        devMsg: dealDaily ? '' : `Không tìm thấy deal daily theo id ${id}`,
        userMsg: dealDaily ? '' : 'Không tìm thấy Deal Daily.',
        data: dealDaily
    }
}

/**
 * Lấy tất cả Deal daily, có filter, sorting, pagination
 * @param {*} req request từ client
 * @author  PMChien (12/09/2024)
 */
const getDealDailis = async (req) => {
    // copy query từ đường dẫn
    let queries = { ... req.query};
    
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(item => delete queries[item]);
  
    // format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
    const formatedQueries = JSON.parse(queryString);
  
    // Filtering - search
    /*
    if(queries?.title) {
      formatedQueries.title = {$regex: queries.title, $options: 'i'}; // chỉ cần 1 số từ map với queries title thì sẽ map
      // i là không phân biệt hoa thường
    }
    */

    let queryCommand = DealDaily.find(formatedQueries);// không dùng await nên nó sẽ ở trạng thái pending
  
    // Sorting
    // Nếu query có sort
    if(req.query?.sort) {
      // tách các trường bằng dấu ',' và nối bằng dấu ' '
      let sortBy = req.query.sort.split(',').join(' ');
      queryCommand =  queryCommand.sort(sortBy); // thêm điều kiện sort vào queryCommand
    }
    else {
      queryCommand = queryCommand.sort("-createdAt");
    }
  
    // Fields Limiting
    // Chỉ chọn ra các trường được chỉ định
    if(req.query?.fields) {
      // Lọc các trường cần lấy, cắt theo ',' và nối bằng ' '
      let fieldsLimit = req.query.fields.split(',').join(' ');
      // chọn các trường cần lấy bằng .select()
      queryCommand = queryCommand.select(fieldsLimit);
    }
  
    // Pagination
    /**
     * Phân trang gồm 2 tham số
     *  - limit : số bản ghi/ documents trên trang
     *  - page: trang hiện tại
     */
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || process.env.LIMIT_PRODUCTS;
    let skip = (page - 1) * limit;
  
    queryCommand = queryCommand.skip(skip).limit(limit);
  
    // execute query
    let result = await queryCommand.exec()
      .then( async (response) => {
        let counts = await DealDaily.find(formatedQueries).countDocuments();
        return {
          success: true,
          code: 200,
          devMsg: "",
          userMsg: "",
          data: response,
          counts: counts
        };
      })
      .catch((error) => {
        throw new BaseError(
          false,
          500,
          error.message,
          ""
        );
      })
    return result;
  }

const getCurrentDealDaily = async () => {
    const currentTime = new Date();

    // Kiểm tra có deal nào hợp lệ trong thời gian current time không
    let currentDeal = await DealDaily.findOne
}
  
module.exports = {
    createDealDaily,
    getDealDailyById,
    getDealDailis
}
