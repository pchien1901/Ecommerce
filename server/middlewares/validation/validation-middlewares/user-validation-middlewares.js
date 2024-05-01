const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

/**
 * middleware bắt lỗi của express validator khi update user
 */
const updateUserMiddleware = asyncHandler((req, res, next) => {
  console.log("Tới update middleware rồi.");
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: errors.array(),
      userMsg: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.",
    })
  }
  next();
});

module.exports = {
  updateUserMiddleware
}