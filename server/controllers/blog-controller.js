const asyncHandler = require("express-async-handler");
const blogServices = require("../services/blog-services");

/**
 * Controller tạo mới bài viết
 * Author: PMChien (03/05/2024)
 */
const createBlog = asyncHandler( async (req, res) => {
  let blog = req.body;
  let result = await blogServices.createBlog(blog);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy một bài viết theo id
 * Author: PMChien (06/05/2024)
 */
const getBlogById = asyncHandler( async (req, res) => {
  let { bid } = req.params;
  let result = await blogServices.getBlogById(bid);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy tất cả bài viết, có search, sort, fields limit, pagination
 * Auhtor: PMChien (06/05/2024)
 */
const getBlogs = asyncHandler( async (req, res) => {
  let result = await blogServices.getBlogs(req);
  return res.status(result?.code).json(result);
})

/**
 * Controller cập nhật bài viết
 * Author: PMChien (03/05/2024)
 */
const updateBlogById = asyncHandler( async (req, res) => {
  let { bid } = req.params;
  let blog = req.body;
  let result = await blogServices.updateBlogById(bid, blog);
  return res.status(result?.code).json(result);
});

/**
 * Controller xóa một bài viết theo id
 * Author: PMchien (03/05/2024)
 */
const deleteBlogById = asyncHandler( async (req, res) => {
  let { bid } = req.params;
  let result = await blogServices.deleteBlogById(bid);
  return res.status(result?.code).json(result);
});

/**
 * Controller like một bài viết theo id
 * Author: PMChien (07/05/2024)
 */
const likeBlog = asyncHandler( async (req, res) => {
  let { _id } = req.user; // lấy _id từ req.user => yêu cầu người dùng phải đăng nhập
  let { bid } = req.params;
  let result = await blogServices.likeBlog(_id, bid);
  return res.status(result?.code).json(result);
});

/**
 * Controller dislike một bài viết theo id
 * Author: PMChien (07/05/2024)
 */
const dislikeBlog = asyncHandler( async (req, res) => {
  let { _id } = req.user; // lấy _id từ req.user => yêu cầu phải đăng nhập
  let { bid } = req.params;
  let result = await blogServices.dislikeBlog(_id, bid);
  return res.status(result?.code).json(result);
});

/**
 * Controller tải ảnh lên
 * Author: PMChien (15/05/2024)
 */
const uploadImage = asyncHandler(async (req, res) => {
  let { bid } = req.params;
  let file = req.file;
  let result = await blogServices.uploadImage(bid, file);
  return res.status(result?.code).json(result);
})

module.exports = {
  createBlog,
  getBlogById,
  getBlogs,
  updateBlogById,
  deleteBlogById,
  likeBlog,
  dislikeBlog,
  uploadImage
}