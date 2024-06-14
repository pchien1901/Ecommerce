const { body, param } = require("express-validator");
const BaseError = require("../../../exception/base-error");
const { isValidObjectId } = require("../../../ultis/helper.js");

/**
 * Validation rules khi thêm thương hiệu
 * @returns validator khi create brand
 * Author : PMChien (07/05/2024)
 */
const createBrandValidationRules = () => {
  return [
    body("title").trim().notEmpty().withMessage("Tên thương hiệu không được để trống."),
  ];
}

/**
 * Validation rules khi cập nhật thương hiệu
 * @returns validator khi update brand
 * Author: PMChien (07/05/2024)
 */
const updateBrandValidationRules = () => {
  return [
    param('brandId').trim().notEmpty().withMessage("Không tìm thấy Id  brand.")
                    .custom( (value) => {
                      let result = isValidObjectId(value);
                      if(result) {
                        return true;
                      }
                      else {
                        throw new BaseError(
                          false,
                          400,
                          "Params brandId không phải ObjectId.",
                          ""
                        );
                      }
                    }),
    body("title").trim().notEmpty().withMessage("Tên thương hiệu không được để trống.")
  ];
}

/**
 * Kiểm tra param brandId có phải objectId không
 * @returns validator khi get by id
 */
const getBrandByIdRules = () => {
  return [
    param('brandId').trim().notEmpty().withMessage("Không tìm thấy Id  brand.")
                    .custom( (value) => {
                      let result = isValidObjectId(value);
                      if(result) {
                        return true;
                      }
                      else {
                        throw new BaseError(
                          false,
                          400,
                          "Params brandId không phải ObjectId.",
                          ""
                        );
                      }
                    }),
  ]
}

module.exports = {
  createBrandValidationRules,
  updateBrandValidationRules,
  getBrandByIdRules
}