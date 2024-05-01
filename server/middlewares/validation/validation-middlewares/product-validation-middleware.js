const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

/**
 * Middleware bắt lỗi của express validator khi create product
 */
const createProductMiddleware = asyncHandler((req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: errors.array(),
      userMsg: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại."
    });
  }
  next();
});

/**
 * Middleware handler lỗi khi validate update product
 */
const updateProductMiddleware = asyncHandler((req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: errors.array(),
      userMsg: "Thông tin chưa hợp lệ, vui lòng kiểm tra lại."
    });
  }
  next();
});

/**
 * Middleware xử lí lỗi khi validator ratings
 */
const ratingsProductMiddleware = asyncHandler((req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: errors.array(),
      userMsg: "Đã xảy ra lỗi."
    });
  }
  next();
});

module.exports = {
  createProductMiddleware,
  updateProductMiddleware,
  ratingsProductMiddleware
}