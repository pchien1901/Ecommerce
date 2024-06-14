const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const BaseError = require("../exception/base-error");

/**
 * Hàm tạo đơn hàng
 * @param {Array} products Mảng { product - productId, quantity - số lượng đặt, color - màu sắc}
 * @param {ObjectId} couponId id của mã giảm giá
 * @param {ObjectId} userId  id của người mua - khách hàng
 * @returns {object} {
 *  success: true - thành công,
 *  code: 201,
 *  devMsg: "",
 *  userMsg: "",
 *  data: đơn hàng đã tạo
 * }
 * Author: PMChien (10/06/2024)
 */
const createOrder = async (products, couponId, userId) => {
  // validate
  if(Array.isArray(products)) {
    if(products.length === 0) {
      throw new BaseError(false, 400, "products is empty.", "");
    }
    products.forEach((item, index) => {
      let hasProduct = item.hasOwnProperty('product');
      let hasQuantity = item.hasOwnProperty('quantity');
      let hasColor = item.hasOwnProperty('color');
      if(!hasProduct) {
        throw new BaseError(false, 400, `Product index ${index} !product.`, "");
      }
      if(!hasQuantity) {
        throw new BaseError(false, 400, `Product index ${index} !quantity.`, "");
      }
      else {
        let isQuantityValid = Number.isInteger(item.quantity) && item.quantity > 0;
        if(!isQuantityValid) {
          throw new BaseError(false, 400, `Product index ${index} has invalid quantity.`, "");
        }
      }
      if(!hasColor) {
        throw new BaseError(false, 400, `Product index ${index} !color.`, "");
      }
    });
  }

  let newOrder = await Order.create({products, orderBy: userId});
  let order = await newOrder.populate("products.product");
  let totalAmount = order.products.reduce((sum, current) => {
    return sum += current.quantity * current.product.price;
  }, 0);
  console.log(totalAmount);
  if(couponId) {
    let coupon = await Coupon.findById(couponId);
    if(coupon) {
      if(coupon.expiry > Date.now()) {
        throw new BaseError(false, 400, "Coupon is expiry.", "Mã giảm giá hết hạn.");
      }
      else {
        totalAmount = Math.round(totalAmount * ( 1 - coupon.discount / 100) / 1000) * 1000;
        order.total = totalAmount;
        await order.save();
        return {
          success: true,
          code: 201,
          devMsg: "",
          userMsg: "Áp dụng mã giảm giá thành công.",
          data: order
        }
      }
    }
    else {
      throw new BaseError(false, 400, "Coupon not found.", "Không tìm thấy mã giảm giá.");
    }
  }
  order.total = totalAmount;
  await order.save();
  return {
    success: true,
    code: 201,
    devMsg: "",
    userMsg: "Tạo đơn hàng thành công.",
    data: order
  }
}

/**
 * Cập nhật trạng thái đơn hàng
 * @param {ObjectId} orderId id của đơn hàng
 * @param {String} status trạng thái cập nhật 
 * @returns {object} {
 *  success: true - thành công, 
 *  code: 200/404
 *  devMsg: "",
 *  userMsg: "",
 *  data: new order
 * }
 * Author: PMChien(10/06/2024)
 */
const updateStatus = async (orderId, status) => {
  let order = await Order.findById(orderId);
  if(order) {
    order.status = status;
    await order.save();
    return {
      success: true,
      code: 200,
      devMsg: "",
      userMsg: "",
      data: order
    }
  }
  else {
    return {
      success: false,
      code: 404,
      devMsg: "findById return null.",
      userMsg: "Đơn hàng không tồn tại."
    }
  }
}

/**
 * Lấy các đơn hàng theo id của người dùng
 * @param {ObjectId} userId id của người dùng cần tìm kiếm lịch sử mua hàng
 * @returns {object} {
 *  success: true - thành công
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: orders - mảng các order của người dùng
 * }
 * Author: PMChien (10/06/2024)
 */
const getOrderByUserId = async (userId) => {
  let orders = await Order.find({ orderBy: userId }).sort("-createdAt");
  return {
    success: true,
    code: 200,
    devMsg: "",
    userMsg: "",
    data: orders
  }
}

/**
 * Lấy một đơn hàng theo id
 * @param {ObjectId} orderId id của đơn hàng 
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/400,
 *  devMsg: "",
 *  userMsg: "",
 *  data: order in DB.
 * }
 * Author: PMChien (11/06/2024)
 */
const getOrderById = async (orderId) => {
  let order = await Order.findById(orderId);
  return {
    success: order ? true : false,
    code: order ? 200 : 400,
    devMsg: order ? "" : `Order.findById(${orderId}) return null.`,
    userMsg: order ? "" : "Đã xảy ra lỗi.",
    data: order
  }
}


/**
 * Lấy tất cả đơn hàng có filter, sorting, pagination
 * @param {*} req reqquest từ client
 * @returns {object} {
 *  success: true - thành công,
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: ordes đã phân trang
 *  counts: tổng số bản ghi theo truy vấn trong DB
 * }
 * Author: PMChien (11/06/2024)
 */
const getOrders = async (req) => {
  // copy query từ đường dẫn.
  let queries = { ...req.query };

  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach(item => delete queries[item]);

  // format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
  const formatedQueries = JSON.parse(queryString);

  // filter
  
  let queryCommand = Order.find(formatedQueries); // không dùng await, dữ trạng thái pending để xử lí sort và paging
  // sort
  if(req.query?.sort) {
    // tách các trường bằng dấu , nối bằng dấu ' '
    let sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy); // thêm sắp xếp
  }
  else {
    queryCommand = queryCommand.sort("-createdAt");
  }

  // fields limiting
  // chọn các trường chỉ định
  if(req.query?.fields) {
    // Lọc các trường cần lấy, cắt theo ',' nối bằng ' '
    let fieldsLimit = req.query.fields.split(',').join(' ');
    // chọn các trường cần lấy bằng .select()
    queryCommand = queryCommand.select(fieldsLimit);
  }

  // pagination
  /**
   * Phân trạng gồm 2 tham số
   *  - limit: số bản ghi/documents  trên 1 trang
   *  - page: trang hiện tại
   */
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || process.env.LIMIT_RECORD;
  let skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // execute query
  let result = await queryCommand.exec()
                      .then(async (response) => {
                        let counts = await Order.find(formatedQueries).countDocuments();
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
                        throw new BaseError(false, 500, error.message, "");
                      });

  return result;
}
module.exports = {
  createOrder,
  updateStatus,
  getOrderByUserId,
  getOrderById,
  getOrders
}