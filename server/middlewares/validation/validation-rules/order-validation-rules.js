const { body, param } = require("express-validator");
const BaseError = require("../../../exception/base-error");
const { isValidObjectId } = require("../../../ultis/helper");

/**
 * validate dữ liệu khi create order
 * @returns validator khi createOrder
 * Author: PMChien (10/06/2024)
 */
const createOrderRules = () => {
  return [
    body('products').exists().withMessage("Danh sách sản phẩm chưa đúng định dạng."),
    body("products.*.product").notEmpty().withMessage("Id sản phẩm không được để trống.")
                              .custom((value) => {
                                let isValidId = isValidObjectId(value);
                                if(!isValidId) {
                                  throw new BaseError(false, 400, "Id is not ObjectId.", "");
                                }
                                return true;
                              }),
    body("products.*.quantity").notEmpty().withMessage("Số lượng sản phẩm không được trống.")
                                .isInt({ gt: 0}).withMessage("Số lượng đặt không được để trống."),
  ]
}

/**
 * Validate khi cập nhật trạng thái đơn hàng
 * @returns validator khi cập nhật trạng thái đơn hàng
 * Author: PMChien (11/06/2024)
 */
const updateStatusRules = () => {
  return [
    param("orderId").trim().custom((value) => {
      let isValidId = isValidObjectid(value);
      if(!isValidId) {
        throw new BaseError(false, 400, "orderId in path is not Object id.");
      }
      return true;
    }),
    body("status").trim().notEmpty().withMessage("Trạng thái đơn hàng không được để trống."),
  ];
}

module.exports = {
  createOrderRules,
  updateStatusRules
}