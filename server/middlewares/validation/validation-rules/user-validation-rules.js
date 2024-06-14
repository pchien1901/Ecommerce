const { body } = require('express-validator');
const User = require("../../../models/user.js");
const BaseError = require("../../../exception/base-error.js");
const { isValidObjectId } = require("../../../ultis/helper.js");

const updateUserValidationRules = () => {
  //console.log("Tới cấu hình body rồi: ");
  return [
    body("firstName").trim().notEmpty().withMessage("Tên không được để trống."),
    body("lastName").trim().notEmpty().withMessage("Họ không được để trống"),
    body("email").trim().notEmpty().withMessage("Email không được để trống.")
                 .isEmail().withMessage("Email không hợp lệ."),
                //  .custom( async (value) => {
                //   // Tìm kiếm một user trong DB có cùng email và có _id không bằng ($ne = not equals) với userId
                //   const user = await User.findOne({ email: value, _id: { $ne : userId } });
                //   if(user) {
                //     throw new BaseError(
                //       false,
                //       400,
                //       "Email đã tồn tại trong DB.",
                //       "Email đã tồn tại trong hệ thống."
                //     );
                //   }
                //   else {
                //     return true; // trả về true để thông qua validator
                //   }
                //  }),
    body("mobile").trim().notEmpty().withMessage("Số điện thoại không được để trống")
                  .custom( (value) => {
                    console.log("value: ", value);
                    const noLettersRegex = /^[^a-zA-Z]*$/;
                    if(!noLettersRegex.test(value)) {
                      throw new BaseError(
                        false,
                        400,
                        "Mobile có chứa kí tự chữ cái.",
                        "Số điện thoại không hợp lệ."
                      );
                      return false;
                    }
                    else {
                      return true;
                    }
                  })
  ]
}

/**
 * Kiểm tra các trường productId, quantity, color, option của body
 * @returns vadilator của update cart
 * Author: PMChien (24/05/2024)
 */
const updateCart = () => {
  return [
    body('productId').trim().notEmpty().withMessage("Sản phẩm không được để trống.")
                      .custom( value => {
                        let isValidId = isValidObjectId(value);
                        if(isValidId) {
                          return true;
                        }
                        throw new BaseError( false, 400, "productId không phải ObjectId.", "Sản phẩm không hợp lệ.");
                      }),
    body("quantity").trim().notEmpty().withMessage("Số lượng không được để trống.")
                    .isInt({ gt: 0}).withMessage("Số lượng phải là số nguyên dương."),
    body("color").trim().notEmpty().withMessage("Phân loại không được để trống.")
                  .isString().withMessage("Phân loại phải là một chuỗi."),
    body('option').trim().notEmpty().withMessage("Chưa có hành động cập nhật.")
                  .isIn(['add', 'delete']),
  ];
}

module.exports = {
  updateUserValidationRules,
  updateCart
}