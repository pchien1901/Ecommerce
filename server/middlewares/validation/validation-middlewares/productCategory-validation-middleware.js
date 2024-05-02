const { validationResult } = require('express-validator');
const BaseError = require("../../../exception/base-error");
const asyncHandler = require('express-async-handler');

/**
 * middleware xử lí lỗi khi thêm danh mục
 */
const createProductCategoryMiddleware = asyncHandler((req, res, next) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: errors.array(),
      userMsg: "Dữ liệu không hợp lệ vui lòng kiểm tra lại."
    });
  }
  next();
});

/**
 * Middleware bắt lỗi khi cập nhật danh mục sp
 */
const updateProductCategoryMiddleware = asyncHandler((req, res, next) => {
  let errors = validationResult(req);
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

module.exports = {
  createProductCategoryMiddleware,
  updateProductCategoryMiddleware
}