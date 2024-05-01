const { body } = require("express-validator");
const Product = require("../../../models/product.js");
const BaseError =require("../../../exception/base-error.js");

/**
 * trả về validator của product
 * @returns validator của product
 * Author: PMChien(26/04/2024)
 */
const createProductValidationRules = () => {
  return [
    body("title").trim().notEmpty().withMessage("Tiêu đề sản phẩm không được để trống."),
    body("brand").trim().notEmpty().withMessage("Nhãn hiệu không được dể trống."),
    body("price").trim().notEmpty().withMessage("Giá tiền không được để trống.")
                 .isNumeric().withMessage("Giá tiền không hợp lệ."),
    body("quantity").trim().optional().isInt().withMessage("Số lượng phải là số nguyên."),
    body("sold").trim().optional().isInt().withMessage("Số lượng đã bán phải là số nguyên."),
    body("totalRatings").trim().optional().isInt().withMessage("Số bài đánh giá phải là số nguyên.")
  ];
}

/**
 * validate giá trị product khi update
 * @returns validator khi update product
 * Author: PMChien(26/04/2024)
 */
const updateProductValidationRules = () => {
  return [
    body("title").trim().notEmpty().withMessage("Tiêu đề sản phẩm không được để trống."),
    body("brand").trim().notEmpty().withMessage("Nhãn hiệu không được dể trống."),
    body("price").trim().notEmpty().withMessage("Giá tiền không được để trống.")
                 .isNumeric().withMessage("Giá tiền không hợp lệ."),
    body("quantity").trim().optional().isInt().withMessage("Số lượng phải là số nguyên."),
    body("sold").trim().optional().isInt().withMessage("Số lượng đã bán phải là số nguyên."),
    body("totalRatings").trim().optional().isInt().withMessage("Số bài đánh giá phải là số nguyên.")
  ];
}

/**
 * ratings validator rules
 * @returns validator khi rating
 * Author: PMChien (01/05/2024)
 */
const ratingValidationRules = () => {
  return [
    body("star").trim().notEmpty().withMessage("Đánh giá không được để trống.")
                .isInt().withMessage("Số sao phải là số nguyên.")
                .custom(value => {
                  if(1 <= value <= 5) {
                    return true;
                  }
                  else {
                    throw new BaseError(false, 400, "Số sao phải nằm trong [1, 5]", "Số sao phải đúng định dạng.")
                  }
                }),
    body("pid").trim().notEmpty().withMessage("ID bài viết không được để trống.")
              .custom(value => {
                let objectIdRegex = /^[0-9a-fA-F]{24}$/;
                if(!objectIdRegex.test(value)) {
                  throw new BaseError(
                    false,
                    400,
                    "product id sai định dạng.",
                    ""
                  );
                }
                return true;
              })
  ];
}

module.exports = {
  createProductValidationRules,
  updateProductValidationRules,
  ratingValidationRules
}