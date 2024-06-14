const { body, param } = require("express-validator");
const BaseError = require("../../../exception/base-error");
const { isValidObjectId } = require("../../../ultis/helper.js");

/**
 * Validation rules khi thêm danh mục bài viết
 * @returns validator khi create blog category
 * Author : PMChien (03/05/2024)
 */
const createBlogCategoryValidationRules = () => {
  return [
    body("title").trim().notEmpty().withMessage("Tên danh mục bài viết không được để trống."),
  ];
}

/**
 * Validation rules khi cập nhật danh mục bài viết
 * @returns validator khi update blog category
 * Author: PMChien (03/05/2024)
 */
const updateBlogCategoryValidationRules = () => {
  return [
    param('bcid').trim().notEmpty().withMessage("Không tìm thấy Id  blog category.")
                    .custom( (value) => {
                      let result = isValidObjectId(value);
                      if(result) {
                        return true;
                      }
                      else {
                        throw new BaseError(
                          false,
                          400,
                          "Params blogCategoryId không phải ObjectId.",
                          ""
                        );
                      }
                    }),
    body("title").trim().notEmpty().withMessage("Tên danh mục bài viết không được để trống.")
  ];
}

module.exports = {
  createBlogCategoryValidationRules,
  updateBlogCategoryValidationRules
}