const brandServices = require("../services/brand-services");
const asyncHandler = require("express-async-handler");

/**
 * Controller thêm mới một brand
 * Author: PMChien (07/05/2024) 
 */
const createBrand = asyncHandler( async (req, res) => {
  let brand = req.body;
  let result = await brandServices.createBrand(brand);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy một thương hiệu theo id
 * Author: PMChien (07/05/2024)
 */
const getBrandById = asyncHandler(async (req, res) => {
  let { brandId } = req.params;
  let result = await brandServices.getBrandById(brandId);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy toàn bộ thương hiệu (search, sort, fields limit, paging)
 * Author: PMChien (07/05/2024)
 */
const getBrands = asyncHandler(async (req, res) => {
  let result = await brandServices.getBrands(req);
  return res.status(result?.code).json(result);
});

/**
 * Controller cập nhật một thương hiệu theo id
 * Author: PMChien (07/05/2024)
 */
const updateBrandById = asyncHandler(async (req, res) => {
  let { brandId } = req.params;
  let brand = req.body;
  let result = await brandServices.updateBrandById(brandId, brand);
  return res.status(result?.code).json(result);
});

/**
 * Controller xóa một thương hiệu theo id
 * Author: PMChien (07/05/2024)
 */
const deleteBrandByid = asyncHandler(async (req, res) => {
  let { brandId } = req.params;
  let result = await brandServices.deleteBrandById(brandId);
  return res.status(result?.code).json(result);
})

module.exports = {
  createBrand,
  getBrandById,
  getBrands,
  updateBrandById,
  deleteBrandByid
}