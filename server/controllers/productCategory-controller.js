const ProductCategory = require("../models/productCategory");
const productCategoryServices = require("../services/productCategory-services");
const asyncHandler = require("express-async-handler");

/**
 * Controller thêm mới danh mục sản phẩm
 * Author: PMChien (02/05/2024)
 */
const createProductCategory = asyncHandler( async (req, res) => {
  let productCategory = req.body;
  let result = await productCategoryServices.createProductCategory(productCategory);
  if(result?.success) {
    return res.status(201).json(result);
  }
  else {
    return res.status(result.code).json(result);
  }
});

/**
 * Controller Lấy một danh mục sản phẩm theo id
 * Author: PMChien (02/05/2024)
 */
const getProductCategoryById = asyncHandler( async (req, res) => {
  let { pcid } = req.params;
  let result = await productCategoryServices.getProductCategoryById(pcid);
  console.log(result);
  if(result?.success) {
    return res.status(200).json(result);
  }
  else {
    return res.status(result.code).json(result);
  }
});

/**
 * Controller lấy tất cả sản phẩm có 
 * Author: PMChien (02/05/2024)
 */
const getProductCategories = asyncHandler( async (req, res) => {
  let result = await productCategoryServices.getProudctCategories(req);
  return res.status(result.code).json(result);
});

/**
 * Controller cập nhật thông tin danh mục sản phẩm theo id
 * Author: PMChien (02/05/2024)
 */
const updateProductCategoryById = asyncHandler( async (req, res) => {
  let { pcid } = req.params;
  let productCategory = req.body;
  let result = await productCategoryServices.updateProductCategoryById(pcid, productCategory);
  return res.status(result?.code).json(result);
});

/**
 * Controller xóa danh mục sản phẩm theo id
 * Author: PMChien (02/05/2024)
 */
const deleteProductCategoryById = asyncHandler( async (req, res) => {
  let { pcid } = req.params;
  let result = await productCategoryServices.deleteProductCategoryById(pcid);
  return res.status(result.code).json(result);
});

module.exports = {
  createProductCategory,
  getProductCategoryById,
  getProductCategories,
  updateProductCategoryById,
  deleteProductCategoryById
}