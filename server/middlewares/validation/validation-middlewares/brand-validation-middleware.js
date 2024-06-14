const { validationResult } = require("express-validator");
const BaseError = require("../../../exception/base-error");
const asyncHandler = require("express-async-handler");

/**
 * Middleware xử lí lỗi khi thêm thương hiệu
 * Author: PMChien (07/05/2024)
 */
const createBrandMiddleware = asyncHandler((req, res, next) => {
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

/**
 * Middleware bắt lỗi khi cập nhật brand
 * Author": PMchien(07/05/2024)
 */
const updateBrandMiddleware = asyncHandler((req, res, next) => {
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

/**
 * Middleware xử lí lỗi khi kiểm tra brandId
 * Author: PMChien (07/05/2024)
 */
const checkBrandIdMiddleware = asyncHandler((req, res, next) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: errors.array(),
      userMsg: ""
    });
  }
  next();
})

module.exports = {
  createBrandMiddleware,
  updateBrandMiddleware,
  checkBrandIdMiddleware
}