const { body } = require('express-validator');
const User = require("../../../models/user.js");
const BaseError = require("../../../exception/base-error.js");

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

module.exports = {
  updateUserValidationRules
}