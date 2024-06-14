const Product = require("../models/product.js");
const asyncHandler = require("express-async-handler");
const BaseError = require("../exception/base-error.js");
const productServices = require("../services/product-services.js");
const { query } = require("express");

/**
 * Controller tạo mới product
 * Author: PMChien(25/04/2024)
 */
const createProduct = asyncHandler(async (req, res) => {
  let product = req.body;
  let result = await productServices.createProduct(product);
  if (result?.success) {
    return res.status(201).json(result);
  } else {
    return res.status(500).json(result);
  }
});

/**
 * Controller lấy tất cả sản phẩm có filter, sorting, pagination
 * Author: PMChien (01/05/2024)
 */
const getProducts = asyncHandler( async (req, res) => {
  /**
   * req.query phải có :
   * title: filter theo tiêu đề sản phẩm
   * sort: sắp xếp theo các trường nào
   * fields: chỉ lấy dữ liệu ở các trường liệt kê ở fields
   * page: trang hiện tại
   * limit: số documents trên trang
   */
  let result = await productServices.getProducts(req);
  if(result?.success) {
    return res.status(200).json(result);
  }
  else {
    return res.status(500).json(result);
  }
});

/**
 * Controller lấy một sản phẩm theo id
 * Author: PMChien (25/04/2024)
 */
const getProductById = asyncHandler(async (req, res) => {
  let { pid } = req.params;
  let result = await productServices.getProductById(pid);
  if(result?.success) {
    return res.status(200).json(result);
  }
  else {
    return res.status(500).json(result);
  }
});

/**
 * Controller cập nhật sản phẩm theo id
 * Author: PMChien(26/04/2024)
 */
const updateProductById = asyncHandler( async (req, res) => {
  let { pid } = req.params;
  let product = req.body;
  let result = await productServices.updateProductById(pid, product);
  if(result?.success) {
    return res.status(200).json(result);
  }
  else {
    return res.status(500).json(result);
  }
});

/**
 * Controller xóa sản phẩm theo id
 */
const deleteProductbyId = asyncHandler( async (req, res) => {
  let { pid } = req.params;
  let result = await productServices.deleteProductById(pid);
  if(result?.success) {
    return res.status(200).json(result);
  }
  else {
    return res.status(404).json(result);
  }
});

/**
 * Controller thêm đánh giá
 */
const ratings = asyncHandler(async (req, res) => {
  // để đăng bài thì cần đăng nhập => verifyToken => có req.user = decode
  const { _id } = req.user;
  const { pid, star, comment } = req.body;
  let result = await productServices.ratings(_id, pid, star, comment);
  if(result?.success) {
    return res.status(200).json(result);
  }
  else {
    return res.status(500).json(result);
  }
});

/**
 * Controller tải ảnh / upload ảnh của sản phẩm
 * Author: PMChien (15/05/2-24)
 */
const uploadImages = asyncHandler( async (req, res) => {
  const { pid } = req.params;
  const files = req.files;
  const result = await productServices.uploadImages(pid, files);
  return res.status(result?.code).json(result);
});

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProductById,
  deleteProductbyId,
  ratings,
  uploadImages
};
