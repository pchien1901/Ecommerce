const blogCategoryServices = require("../services/blogCategory-services");
const asyncHandler = require("express-async-handler");

/**
 * Controller thêm mới một blog category
 * Author: 
 */
const createBlogCategory = asyncHandler( async (req, res) => {
  let blogCategory = req.body;
  let result = await blogCategoryServices.createBlogCategory(blogCategory);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy một danh mục bài viết theo id
 * Author: PMChien (03/05/2024)
 */
const getBlogCategoryById = asyncHandler(async (req, res) => {
  let { bcid } = req.params;
  let result = await blogCategoryServices.getBlogCategoryById(bcid);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy toàn bộ danh mục bài viết (search, sort, fields limit, paging)
 */
const getBlogCategories = asyncHandler(async (req, res) => {
  let result = await blogCategoryServices.getBlogCategories(req);
  return res.status(result?.code).json(result);
});

/**
 * Controller cập nhật một danh mục bài viết theo id
 * Author: PMChien (03/05/2024)
 */
const updateBlogCategoryById = asyncHandler(async (req, res) => {
  let { bcid } = req.params;
  let blogCategory = req.body;
  let result = await blogCategoryServices.updateBlogCategoryById(bcid, blogCategory);
  return res.status(result?.code).json(result);
});

/**
 * Controller xóa một danh mục bài viết theo id
 * Author: PMChien (03/05/2024)
 */
const deleteBlogCategoryByid = asyncHandler(async (req, res) => {
  let { bcid } = req.params;
  let result = await blogCategoryServices.deleteBlogCategoryById(bcid);
  return res.status(result?.code).json(result);
})

module.exports = {
  createBlogCategory,
  getBlogCategoryById,
  getBlogCategories,
  updateBlogCategoryById,
  deleteBlogCategoryByid
}