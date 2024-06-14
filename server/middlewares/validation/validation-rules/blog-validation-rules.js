const { body, param } = require("express-validator");
const BaseError = require("../../../exception/base-error");
const { isValidObjectId } = require("../../../ultis/helper");

/**
 * validation rules khi thêm bài viết
 * @returns validator khi thêm bài viết
 * Author: PMChien (03/05/2024)
 */
const createBlogValidationRules = () => {
  return [
    body("title").trim().notEmpty().withMessage("Tên bài viết không được để trống."),
    body("description").trim().notEmpty().withMessage("Mô tả bài viết không được để trống."),
    body("category").trim().notEmpty().withMessage("Danh mục bài viết không được để trống.")
  ];
}

/**
 * validation rules khi sửa bài viết
 * @returns validator khi sửa bài viết
 * Author: PMChien (03/05/2024)
 */
const updateBlogValidationRules = () => {
  return [
    param("pid").trim().notEmpty().withMessage("Id bài viết không có")
                .custom((value) => {
                  let result = isValidObjectId(value);
                  if(result) {
                    return true;
                  }
                  else {
                    throw new BaseError(
                      false,
                      400,
                      "Blog Id bị sai.",
                      ""
                    );
                  }
                }),
    body("title").trim().notEmpty().withMessage("Tên bài viết không được để trống."),
    body("description").trim().notEmpty().withMessage("Mô tả bài viết không được để trống."),
    body("category").trim().notEmpty().withMessage("Danh mục bài viết không được để trống.")
  ];
}

/**
 * validator rules kiểm tra blog Id trên param có phải ObjectId không
 * @returns validator delete blog
 * Author: PMChien (03/05/2024)
 */
const deleteBlogValidationRules = () => {
  return [
    param("bid").trim().notEmpty().withMessage("Blog Id không được để trống.")
                .custom((value) => {
                  let result = isValidObjectId(value);
                  if(result) {
                    return true;
                  }
                  else {
                    throw new BaseError(
                      false,
                      400,
                      "Blog Id bị sai.",
                      ""
                    );
                  }
                })
  ]
}

/**
 * kiểm tra param bid có phải object id không
 * @returns validator khi lấy một bài đăng
 * Author: PMChien (06/05/2024)
 */
const getBlogByIdRules = () => {
  return [
    param("bid").trim().notEmpty().withMessage("Không tìm thấy id bài viết.")
                .custom( (value) => {
                  let result = isValidObjectId(value);
                  if(result) {
                    return true;
                  }
                  else {
                    throw new BaseError(
                      false,
                      400,
                      "Blog id không phải ObjectId.",
                      "Đã có lỗi xảy ra."
                    )
                  }
                })
  ]
}

/**
 * validate param blog id phải là object id
 * @returns validator khi like blog
 * author: PMChien (07/05/2024)
 */
const likeBlogRules = () => {
  return [
    param("bid").trim().notEmpty().withMessage("Không tìm thấy id bài viết.")
                .custom( (value) => {
                  let result = isValidObjectId(value);
                  if(result) {
                    return true;
                  }
                  else {
                    throw new BaseError(
                      false,
                      400,
                      "Blog id không phải ObjectId.",
                      "Đã có lỗi xảy ra."
                    )
                  }
                })
  ];
}

/**
 * validate param blog id phải là object id
 * @returns validator khi dislike blog
 * author: PMChien (07/05/2024)
 */
const dislikeBlogRules = () => {
  return [
    param("bid").trim().notEmpty().withMessage("Không tìm thấy id bài viết.")
                .custom( (value) => {
                  let result = isValidObjectId(value);
                  if(result) {
                    return true;
                  }
                  else {
                    throw new BaseError(
                      false,
                      400,
                      "Blog id không phải ObjectId.",
                      "Đã có lỗi xảy ra."
                    )
                  }
                })
  ];
}

module.exports = {
  createBlogValidationRules,
  updateBlogValidationRules,
  deleteBlogValidationRules,
  getBlogByIdRules,
  likeBlogRules,
  dislikeBlogRules
}