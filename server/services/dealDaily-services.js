const DealDaily = require('../models/dealDaily.js');
const Coupon = require('../models/coupon.js');
const Product = require('../models/product.js');
const BaseError =  require('../exception/base-error.js');
const { isValidObjectId } = require('../ultis/helper.js');
const mongoose = require('mongoose');

/**
 * Hàm tạo mới một deal daily 
 * @param {ObjectId} productId id của sản phẩm thêm vào deal daily
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

    let dealDaily = await DealDaily.create({product: productId, startTime: startTime, endTime: endTime });

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
        dealDaily.coupon = coupon._id;
        await dealDaily.save();
    }

    dealDaily = await DealDaily.findById(dealDaily._id).populate('product').populate('coupon');
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
 * @param {ObjectId} id id của deal daily
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
    let dealDaily = await DealDaily.findById(id).populate('product').populate('coupon');
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
const getDealDailys = async (req) => {
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

    // Thêm populate
    queryCommand = queryCommand.populate('product').populate('coupon');
  
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

  /**
   * Trả về deal daily hiện tại, nếu không có thì lấy deal từ danh sách deal sp ngẫu nhiên, không có nữa thì tạo deal mới từ sp ngẫu nhiên
   * @returns {object} {
   *   success: true - thành công/ false,
   *   code: 200,
   *    devMsg: "".
   *    userMsg: "",
   *    data: deal daily hiện tại
   * }
   * @author PMChien (12/09/2024)
   */
const getCurrentDealDaily = async () => {
    const currentTime = new Date();

    // Kiểm tra có deal nào hợp lệ trong thời gian current time không
    // lấy deal daily có endTime gần nhất thỏa mãn startTime <= currentTime <= endTime 
    let currentDeal = await DealDaily.findOne({
                              startTime: { $lte: currentTime },
                              endTime: { $gte: currentTime }
                            })
                            .sort({ endTime: 1 })
                            .populate('product')
                            .populate('coupon');
    if(currentDeal) {
      return {
        success: true,
        code: 200,
        devMsg: 'Lấy deal daily thành công',
        userMsg: '',
        data: currentDeal,
      }
    }
    else {
      // Nếu không có currentDeal, thực hiện lấy các bản ghi được đánh dấu ngẫu nhiên
      let randomDeal = await DealDaily.findOne({
        isRandom: true,
        endTime: { $gte: currentTime }
      }).sort({endTime : 1 }).populate('product');
      if(randomDeal) {
        return {
          success: true,
          code: 200,
          devMsg: 'Lấy deal daily thành công',
          userMsg: '',
          data: randomDeal,
        }
      }
      else {
        // Thực hiện tạo một randomDeal 
        // Lấy một product ngẫu nhiên
        const randomProduct = await Product.aggregate([{ $sample: {size : 1}}]);
        //console.log('randomProduct: ', randomProduct);
        if(!randomProduct.length) {
          throw new BaseError(false, 404, "Không có sản phẩm để tạo deal daily", "Hệ thống sản phẩm chưa sẵn sàng.");
        }
        const startTime = currentTime;
        const endTime = new Date(currentTime.getTime() + process.env.DEFAULT_HOUR * 60 * 60 * 1000); // số giờ sau hết hạn được khai báo trong process.env. ( phải nhân với 1000 vì tính theo mili giây)
        let newRandomDeal = await DealDaily.create({
          product: randomProduct[0]._id,
          startTime: startTime,
          endTime: endTime,
          isRandom: true
        });

        newRandomDeal = await DealDaily.findById(newRandomDeal._id).populate('product');
        return {
          success: true,
          code: 200,
          devMsg: 'Lấy deal daily thành công',
          userMsg: '',
          data: newRandomDeal,
        }
      }
    }
}

/**
 * cập nhật deal daily theo id
 * @param {ObjectId} dealDailyId id của deal daily cần update
 * @param {object} dealDaily dealdaily truyền từ client lên
 * @returns {object} {
 *  success: true - thành công/ false,
 *  code: 200/500,
 *  devMsg: '', 
 *  userMsg: '',
 *  data: updated deal daily
 * }
 * @author PMChien (15/09/2024)
 */
const updateDealDailyById = async (dealDailyId, dealDaily) => {
  // Tìm deal daily trong db xem có không
  let dealDailyInDb = await DealDaily.findById(dealDailyId);
  if(!dealDailyInDb) {
    throw new BaseError(
      false, 
      404, 
      `Không tìm thấy deal daily theo id ${dealDailyId}`, 
      'Không tìm thấy deal daily.'
    );
  }
  
  // Lấy giá trị startTime và endTime từ đối tượn dealDaily gửi từ client gán vào 2 biến newStartTime, newEndTime
  let { startTime: newStartTime, endTime: newEndTime } = dealDaily;
  dealDailyInDb.startTime = newStartTime;
  dealDailyInDb.endTime = newEndTime;

  // Kiểm tra productId có hợp lệ không
  let product = await Product.findById(dealDaily.product._id);
  if(!product) {
    throw new BaseError(
      false,
      400,
      ` Không tìm thấy product có id là ${dealDaily.product._id}`,
      'Sản phẩm tạo deal daily không tồn tại.'
    );
  }

  // Gán lại product bằng productId của data gửi lên
  dealDailyInDb.product = dealDaily.product._id;

  // Kiểm tra couponId có hợp lệ không nếu client gửi lên có coupon
  if(dealDaily.coupon && dealDaily.coupon._id) {
    let coupon = await Coupon.findById(dealDaily.coupon._id);
    if(!coupon) {
      throw new BaseError(
        false,
        400,
        `Không tìm thấy coupon có id là ${dealDaily.coupon._id} .`,
        'Mã giảm giá không hợp lệ.'
      );
    }

    // Trường hợp mã giảm giá hợp lệ, lấy tên mã giảm giá và % giảm giá để kiểm tra.
    let { _id, name, discount } = dealDaily.coupon;
    let conflictCouponInDb = await Coupon.find({ name: name, _id: {$ne : _id}});
    if(conflictCouponInDb.length === 0) {
      // Nếu không bị trùng name với coupon khác đã tồn tại thì cập nhật tên và tỉ lệ giảm giá.
      coupon.name = name;
      coupon.discount = discount;
      coupon.expiry = newEnndTime;
      await coupon.save();
      // Gán lại coupon._id mới vào dealDailyInDb
      dealDailyInDb.coupon = coupon._id;
    }
    else {
      throw new BaseError(
        false,
        400,
        `Tên mã giảm giá ${name} đã tồn tại trong DB.`,
        `Mã giảm giá có tên ${name} đã tồn tại, vui lòng đặt tên khác.`
      );
    }
  }
  else {
    // trường hợp client gửi lên không có coupon thì cập nhật lại dealDailyInDb.coupon = null.
    dealDailyInDb.coupon = null;
  }

  await dealDailyInDb.save();

  let result = await DealDaily.findById(dealDailyId).populate('product').populate('coupon');
  return {
    success: result ? true : false,
    code: result ? 200 : 500,
    devMsg: result ? 'Cập nhật thành công.' : 'Cập nhật thất bại.',
    userMsg: result ? 'Cập nhật thành công.' : 'Cập nhật thất bại.',
    data: result
  }
}

/**
 * Xóa dealDaily theo id
 * @param {ObjectId} id của deal daily
 * @returns {object} {
 *  success: true - thành công/ false,
 *  code: 200/ 500,
 *  devMsg: '',
 *  userMsg: ''
 *  data: deleted deal daily
 * }
 * @author PMChien (15/09/2024)
 */
const deleteDealDailyById = async (dealDailyId) => {
  let result = await DealDaily.findByIdAndDelete(dealDailyId);
  return {
    success: result ? true : false,
    code: result ? 200 : 500,
    devMsg: result ? 'Xóa thành công.' : 'Xóa không thành công.',
    userMsg: result ? 'Xóa thành công.' : 'Xóa không thành công.',
    data: result
  }
}

  
module.exports = {
    createDealDaily,
    getDealDailyById,
    getDealDailys,
    getCurrentDealDaily,
    updateDealDailyById,
    deleteDealDailyById
}
