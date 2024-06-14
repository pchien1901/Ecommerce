const { body, param } = require("express-validator");
const BaseError = require("../../../exception/base-error");
const { isValidObjectId } = require("../../../ultis/helper");

/**
 * Validator của create coupon
 * Author: PMChien (15/05/2024)
 */
const createCouponRules = () => {
  return [
    body("name").trim().notEmpty().withMessage("Tên mã giảm giá không được để trống."),
    body("discount").trim().notEmpty().withMessage("Tỉ lệ giảm giá không được để trống.")
                    .isNumeric().withMessage("Tỉ lệ giảm giá phải là một số.")
                    .custom( (value) => {
                      if(value <= 0) {
                        throw new BaseError(
                          false,
                          400,
                          "discout <= 0.",
                          "Tỉ lệ giảm giá phải lớn hơn 0%."
                        );
                      }
                      return true;
                    }),
    body("expiry").trim().notEmpty().withMessage("Ngày hết hạn giảm giá không được để trống.")
                  .custom( (value) => {
                    let timestamp = Date.parse(value);
                      if(!isNaN(timestamp)) {
                        let now = Date.now();
                        if(timestamp >= now) {
                          return true;
                        }
                        else {
                        throw new BaseError( false, 400, "Ngày không hợp lệ, ngày hết hạn nhỏ hơn hiện tại.", "Ngày không hợp lệ.");
                        }
                      }
                      else {
                        throw new BaseError( false, 400, "Ngày không hợp lệ.", "Ngày không hợp lệ.");
                      }
                  })
  ];
}

/**
 * Kiểm tra couponId param, validate name, discount, expiry
 * @returns Validator update coupon
 * Author: PMChien (15/05/2024)
 */
const updateCouponRules = () => {
  return [
    param("couponId").trim().notEmpty().withMessage("Đường dẫn không hợp lệ.")
                      .custom( (value) => {
                        let isValidId = isValidObjectId(value);
                        if(isValidId) {
                          return true;
                        }
                        else {
                          throw new BaseError (false, 400, "couponId không phải ObjectId.", "");
                        }
                      }),
    body("name").trim().notEmpty().withMessage("Tên mã giảm giá không được để trống."),
    body("discount").trim().notEmpty().withMessage("Tỉ lệ giảm giá không được để trống.")
                    .isNumeric().withMessage("Tỉ lệ giảm giá phải là một số.")
                    .custom( (value) => {
                      if(value <= 0) {
                        throw new BaseError(
                          false,
                          400,
                          "discout <= 0.",
                          "Tỉ lệ giảm giá phải lớn hơn 0%."
                        );
                      }
                      return true;
                    }),
    body("expiry").trim().notEmpty().withMessage("Ngày hết hạn giảm giá không được để trống.")
                  .custom( (value) => {
                    let timestamp = Date.parse(value);
                      if(!isNaN(timestamp)) {
                        let now = Date.now();
                        if(timestamp >= now) {
                          return true;
                        }
                        else {
                        throw new BaseError( false, 400, "Ngày không hợp lệ, ngày hết hạn nhỏ hơn hiện tại.", "Ngày không hợp lệ.");
                        }
                      }
                      else {
                        throw new BaseError( false, 400, "Ngày không hợp lệ.", "Ngày không hợp lệ.");
                      }
                  })                  
  ];
}

module.exports = {
  createCouponRules,
  updateCouponRules
}