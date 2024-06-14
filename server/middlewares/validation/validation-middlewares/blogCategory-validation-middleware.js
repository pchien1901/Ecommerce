const { validationResult } = require("express-validator");
const BaseError = require("../../../exception/base-error");
const asyncHandler = require("express-async-handler");

/**
 * Middleware xử lí lỗi khi thêm danh mục bài viết
 * Author: PMChien (03/05/2024)
 */
const createBlogCategoryMiddleware = asyncHandler((req, res, next) => {
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
 * Middleware bắt lỗi khi cập nhật blog category
 * Author": PMchien(03/05/2024)
 */
const updateBlogCategoryMiddleware = asyncHandler((req, res, next) => {
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
})

module.exports = {
  createBlogCategoryMiddleware,
  updateBlogCategoryMiddleware
}