const { validationResult } = require("express-validator");
const BaseError = require("../../../exception/base-error");
const asyncHandler = require("express-async-handler");

/**
 * Middleware xử lí lỗi khi validate thêm bài viết
 */
const createBlogMiddleware = asyncHandler((req, res, next) => {
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
 * Middleware xử lí lỗi khi validate cập nhật bài viết
 */
const updateBlogMiddleware = asyncHandler((req, res, next) => {
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
 * Middleware xử lí lỗi khi validate xóa 1 bài viết
 */
const deleteBlogMiddleware = asyncHandler((req, res, next) => {
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
 * middleware hứng lỗi khi get blog by id
 * Author: PMChien (06/05/2024)
 */
const getBlogByIdMiddleware = asyncHandler((req, res, next) => {
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
 * Middleware xử lí lỗi khi like/dislike blog
 */
const favouriteBlogMiddleware = asyncHandler((req, res, next) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: errors.array(),
      userMsg: "Đã có lỗi xảy ra."
    });
  }
  next();
});

module.exports = {
  createBlogMiddleware,
  updateBlogMiddleware,
  deleteBlogMiddleware,
  getBlogByIdMiddleware,
  favouriteBlogMiddleware
}