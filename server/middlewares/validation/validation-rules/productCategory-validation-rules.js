const { body, param } = require('express-validator');
const BaseError = require('../../../exception/base-error');
const { isValidObjectId } = require('../../../ultis/helper.js');

/**
 * Validation rules khi thêm một danh mục sản phẩm
 * @returns valiator
 * Author: PMChien (02/05/2024)
 */
const createProductCategoryValidationRules = () => {
  return [
    body("title").trim().notEmpty().withMessage("Tên danh mục không được để trống.")
  ];
}

/**
 * Kiểm tra param và body product category trước khi update
 * @returns validator 
 * Author: PMChien (02/05/2024)
 */
const updateProductCategoryValidationRules = () => {
  return [
    param("pcid").trim().notEmpty().withMessage("Không tìm thấy ID danh mục.")
                    .custom((value) => {
                      let result = isValidObjectId(value);
                      if(result) {
                        return true;
                      }
                      else {
                        throw new BaseError (
                          false, 
                          400,
                          "Params productCategoryId không phải object id.",
                          "",
                        );
                      }
                    }),
    body("title").trim().notEmpty().withMessage("Tên danh mục không được bỏ trống.")
  ];
}

module.exports = {
  createProductCategoryValidationRules,
  updateProductCategoryValidationRules
}