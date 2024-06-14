const asyncHandler = require("express-async-handler");
const BaseError = require("../../../exception/base-error");
const { validationResult } = require("express-validator");

const validationMiddleware = asyncHandler( (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: errors.array(),
      userMsg: "Dữ liệu chưa hợp lệ, vui lòng thử lại."
    });
  }
  next();
});

module.exports = {
  validationMiddleware
}