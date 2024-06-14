const ProductCategory = require("../models/productCategory");
const BaseError = require("../exception/base-error.js");

/**
 * Thêm mới một danh mục sản phẩm
 * @param {*} productCategory danh mục mới cần thêm
 * @returns {object} {
 *  success: true - thành công,
 *  code: 201/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: createdProductCategory
 * }
 * Author: PMChien (02/05/2024)
 */
const createProductCategory = async (productCategory) => {
  console.log(productCategory);
  let existProductCategory = await ProductCategory.findOne( { title: productCategory.title });
  console.log(existProductCategory);
  if(!existProductCategory) {
    let result = await ProductCategory.create(productCategory);
    return {
      success: result ? true : false,
      code: result ? 201 : 500,
      devMsg: result ? "create product category thành công." : "create return null.",
      userMsg: result ? "Thêm mới danh mục sản phẩm thành công." : "Đã xảy ra lỗi.",
      data: result
    };
  }
  else {
    throw new BaseError(
      false,
      400,
      "title bị trùng.",
      "Tên danh mục đã tồn tại."
    );
  }
}

/**
 * Lấy danh mục sản phẩm theo id
 * @param {*} _id id của product category
 * @returns {object} {
 *  success: true - thành công,
 *  code: 200/404,
 *  devMsg: "".
 *  userMsg: "",
 *  data: product category
 * }
 * Author: PMChien (02/05/2024)
 */
const getProductCategoryById = async (_id) => {
  let productCategory = await  ProductCategory.findById(_id);
  return {
    success: productCategory ? true : false,
    code: productCategory ? 200 : 404,
    devMsg: productCategory ? "" : "findById return null.",
    userMsg: productCategory ? "" : "Không tìm thấy danh mục sản phẩm.",
    data: productCategory
  }
}

/**
 * Lấy toàn bộ bản ghi (có filter, paging, sorting)
 * @param {*} req request của client
 * @returns {object} {
 *  success: true - thành công,
 *  code: 200/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: all product sau filter, sort, paging,
 *  counts: tổng số bản ghi truy vấn được
 * }
 * Author: PMChien (02/05/2024)
 */
const getProudctCategories = async (req) => {
  // copy query từ đường dẫn
  let queries = { ... req.query};

  // tách các trường đặc biệt khỏi queries
  const excludeFields = ['limit', 'sort', 'fields', 'page'];
  excludeFields.forEach(item => delete queries[item]);

  // format lại operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchEl => `$${matchEl}`);
  const formatQueries = JSON.parse(queryString);

  // Filtering
  if(queries?.title) {
    formatQueries.title = { $regex: queries.title, $options: 'i'};
    // kiểm tra title trong db có regex giống title, i là không phân biệt hoa thường
  }
  let queryCommand = ProductCategory.find(formatQueries); // không dùng await để thêm các phần sort, pageing

  // sorting
  if(req.query?.sort) {
    let sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy);
  }
  else {
    queryCommand = queryCommand.sort("-createdAt");
  }

  // fields limiting 
  if(req.query?.fields) {
    let fieldsLimit = req.query.fields.split(',').join(' ');
    queryCommand = queryCommand.select(fieldsLimit);
  }

  //pagination
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || process.env.LIMIT_RECORDS;
  let skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // execute query
  let result = await queryCommand.exec()
    .then( async (response) => {
      let counts = await ProductCategory.find(formatQueries).countDocuments();
      return {
        success: true,
        code: 200,
        devMsg: "",
        userMsg: "",
        data: response,
        counts: counts,
      };
    })
    .catch((error) => {
      throw new BaseError(
        false,
        500,
        error.message,
        ""
      );
    });
  return result;
}

/**
 * Cập nhật danh mục sản phẩm theo id
 * @param {import("mongoose").ObjectId} pcid id của danh mục cần cập nhật
 * @param {Object} productCategory danh mục sản phẩm mới
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: new product category,
 * }
 * @exception {BaseError} {
 *  false,
 *  400,
 *  "",
 *  ""
 * }
 * Author: PMChien (02/05/2024)
 */
const updateProductCategoryById = async ( pcid, productCategory) => {
  let productCategoryInDB = await ProductCategory.findById(pcid);
  if(!productCategoryInDB) {
    throw new BaseError(
      false,
      400,
      "Không tồn tại product category trong db.",
      "Đã có lỗi xảy ra."
    );
  }

  // Tìm kiếm xem có tồn tại bản ghi có cùng title mà khác id không, nếu có thì bị trùng
  let conflictProductCategory = await ProductCategory.findOne( 
    { title: productCategory.title, _id: { $ne: pcid}}
  );
  if(conflictProductCategory) {
    throw new BaseError(
      false,
      400,
      "Title của product category bị trùng.",
      "Tên danh mục sản phẩm đã tồn tại."
    );
  }
  else {
    let newProductCategory = await ProductCategory.findByIdAndUpdate(
      pcid,
      productCategory,
      { new : true }
    );
    return {
      success: newProductCategory ? true : false,
      code: newProductCategory ? 200 : 500,
      devMsg: newProductCategory ? "" : "findByIdAndUpdate return null.",
      userMsg: newProductCategory ? "Cập nhật danh mục sản phẩm thành công." : "Cập nhật danh mục sản phẩm thất bại.",
      data: newProductCategory
    }
  }
}

/**
 * Xóa danh mục sản phẩm theo Id
 * @param {ObjectId} pcid id của danh mục cần xóa
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: deleted product category
 * }
 *  Author: PMChien (02/05/2024)
 */
const deleteProductCategoryById = async (pcid) => {
  let deletedProductCategory = await ProductCategory.findByIdAndDelete(pcid);
  return {
    success: deletedProductCategory ? true : false,
    code: deletedProductCategory ? 200 : 400,
    devMsg: deletedProductCategory ? "" : "findByIdAndDelete return null.",
    userMsg: deletedProductCategory ? "Xóa danh mục thành công." : "Xóa danh mục chưa thành công.",
    data: deletedProductCategory
  }
}

module.exports = {
  createProductCategory,
  getProductCategoryById,
  getProudctCategories,
  updateProductCategoryById,
  deleteProductCategoryById
}