const Coupon = require("../models/coupon");
const BaseError = require("../exception/base-error");
const { isValidObjectId } = require("../ultis/helper");

/**
 * Tạo mã giảm giá mới
 * @param {Object} coupon object đại diện cho mã giảm giá cần tạo
 * @returns {Object} {
 *  success: true - thành công/ false - thất bại,
 *  code: 201/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: created coupon
 * }
 * Author: PMChien (08/05/2024)
 */
const createCoupon = async (coupon) => {
  let existCoupon = await Coupon.find({ name: coupon.name });
  if (existCoupon.length !== 0) {
    throw new BaseError(
      false,
      400,
      "Mã coupon đã tồn tại trong DB.",
      "Mã giảm giá đã tồn tại."
    );
  } else {
    let result = await Coupon.create(coupon);
    return {
      success: result ? true : false,
      code: result ? 201 : 500,
      devMsg: result ? "" : "Counpon.create return null.",
      userMsg: result
        ? "Tạo mã giảm giá thành công."
        : "Tạo mã giảm giá chưa thành công.",
      data: result,
    };
  }
};

/**
 * Lấy mã giảm giá theo id
 * @param {ObjectId} couponId id của mã giảm giá
 * @returns {Object} {
 *  success: true - thành công/ false - thất bại,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: coupon
 * }
 * Author: PMChien (08/05/2024)
 */
const getCouponById = async (couponId) => {
  let isValidId = isValidObjectId(couponId);
  if (!isValidId) {
    throw new BaseError(
      false,
      400,
      "id không phải ObjectId.",
      "Đã xảy ra lỗi."
    );
  }
  let couponInDb = await Coupon.findById(couponId);
  return {
    success: couponInDb ? true : false,
    code: couponInDb ? 200 : 404,
    devMsg: couponInDb ? "" : "findById return null.",
    userMsg: couponInDb ? "" : "Không tìm thấy mã giảm giá.",
    data: couponInDb,
  };
};

/**
 * Lấy tất cả mã giảm giá, có tìm kiếm, limit fields, sort, pagination
 * @param {request} req request từ client
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: Array of coupon,
 *  counts: total coupon by req.query
 * }
 * Author: PMChien (10/05/2024)
 */
const getCoupons = async (req) => {
  // Tạo bản sao của req.query
  let queries = { ...req.query };
  // Khai báo các key cần loại bỏ khỏi object
  const excludeFields = ["limit", "page", "sort", "fields"];
  // Loại bỏ các key ở queries
  excludeFields.forEach((item) => delete queries[item]);

  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchItem) => `$${matchItem}`
  );
  const formatedQueries = JSON.parse(queryString);

  // Search
  if (queries?.name) {
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  }

  let queryCommand = Coupon.find(formatedQueries); // không dùng await để bổ sung sort và fields limit
  // sort
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  } else {
    queryCommand = queryCommand.sort("-createdAt");
  }

  // Fields limit
  if (req.query.fields) {
    let fieldsLimit = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fieldsLimit);
  }

  // Pagination
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || process.env.LIMIT_RECORDS;
  let skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);
  // execute query
  let result = await queryCommand
    .exec()
    .then(async (response) => {
      let counts = await Coupon.find(formatedQueries).countDocuments();
      return {
        success: true,
        code: 200,
        devMsg: "",
        userMsg: "",
        data: response,
        counts: counts,
      };
    })
    .catch((error) => {
      throw new BaseError(false, 500, error.message, "");
    });
  return result;
};

/**
 * Cập nhật coupon trong db
 * @param {ObjectId} id id của mã giảm giá cần cập nhật
 * @param {*} coupon coupon cập nhật
 * @returns {Object} {
 *  success: true- thành công,
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: updated coupon
 * }
 * Author: PMChien (09/05/2024)
 */
const updateCouponById = async (id, coupon) => {
  let couponInDb = await Coupon.findById(id);
  if(!couponInDb) {
    throw new BaseError (
      false,
      404,
      "Coupon.findById return null.",
      "Đã xảy ra lỗi."
    );
  }
  let conflictCouponInDb = await Coupon.find({ name: coupon.name, _id: {$ne : id}});
  if(conflictCouponInDb.length === 0) {
    couponInDb.set(coupon); // không dùng destructuring và spread vì mất toán tử save
    await couponInDb.save();// phải có await
    return {
      success: true,
      code: 200,
      devMsg: "",
      userMsg: "Cập nhật mã giảm giá thành công.",
      data: couponInDb
    }
  }
  else {
    throw new BaseError(false, 400, "name bị trùng.", "Mã giảm giá đã tồn tại.");
  }
}

/**
 * Xóa mã giảm giá theo id
 * @param {ObjectId} couponId id của mã giảm giá
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: deleted coupon
 * }
 * Author: PMChien (10/05/2024)
 */
const deleteCouponById = async (couponId) => {
  let isValidId = isValidObjectId(couponId);
  if(!isValidId) {
    throw new BaseError (
      false,
      400,
      "id không hợp lệ.",
      "Đã xảy ra lỗi."
    );
  }
  let deletedCoupon = await Coupon.findByIdAndDelete(couponId);
  return {
    success: deletedCoupon ? true : false,
    code: deletedCoupon ? 200 : 500,
    devMsg: deletedCoupon ? "" : "findByIdAndDelete return null.",
    userMsg: deletedCoupon ? "Xóa mã giảm giá thành công." : "Không tìm thấy mã giảm giá.",
    data: deletedCoupon
  }
}

module.exports = {
  createCoupon,
  getCouponById,
  getCoupons,
  updateCouponById,
  deleteCouponById
};
