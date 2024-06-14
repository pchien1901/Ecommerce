const BlogCategory = require("../models/blogCategory");
const BaseError = require("../exception/base-error");
const regex = require("../resources/regex.js");

/**
 * Tạo mới một danh mục bài viết
 * @param {Object} blogCategory danh mục bài viết mới cần tạo
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 201/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: result created blog category
 * }
 * @exception {BaseError} {
 *  false, 400, "", ""
 * }
 * Author: PMChien (02/05/2024)
 */
const createBlogCategory = async (blogCategory) => {
  // Kiểm tra đã tồn tại danh mục bài viết chưa
  let existBlogCategory = await BlogCategory.findOne( { title: blogCategory.title });
  if(existBlogCategory) {
    throw new BaseError(
      false,
      400,
      "Blog title đã tồn tại trong db.",
      "Tên danh mục bài viết đã tồn tại."
    );
  }
  else {
    let result = await BlogCategory.create(blogCategory);
    return {
      success: result ? true : false,
      code: result ? 201 : 500,
      devMsg: result ? "" : "create(blogCategory) return null.",
      userMsg: result ? "Tạo danh mục bài viết thành công." : "Tạo danh mục bài viết thất bại.",
      data: result
    };
  }
}

/**
 * Lấy một danh mục sản phẩm theo id
 * @param {*} bcid id của blogCategory
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: blog category cần lấy
 * }
 * author: PMChien (02/05/2024)
 */
const getBlogCategoryById = async (bcid) => {
  let blogCategory = await BlogCategory.findById(bcid);
  return {
    success: blogCategory ? true : false,
    code: blogCategory ? 200 : 404,
    devMsg: blogCategory ? "" : "findById(bcid) return null.",
    userMsg: blogCategory ? "" : "Không tìm thấy danh mục bài viết.",
    data: blogCategory
  }
}

/**
 * Lấy toàn bộ bản ghi có (search, filter, sort, pagination)
 * @param {*} req request của client
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: all product sau search filter sort
 *  counts: tổng số bản ghi truy vấn được
 * }
 * Author: PMChien (02/05/2024)
 */
const getBlogCategories = async (req) => {
  // Tác queries
  const queries = { ... req.query}; // Tạo đối tượng mới từ req.query
  const excludeFields = ['sort', 'limit', 'page', 'fields']; // Các trường cần loại bỏ
  excludeFields.forEach(item => delete queries[item]); // loại bỏ để convert 

  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(regex.RegexFilterSorting, matchItem => `$${matchItem}`);
  const formatQueries = JSON.parse(queryString);

  // Filtering - Search
  // nếu trong queries có trường title => tìm kiếm theo tilte
  if(queries?.title) {
    // kiểm tra title trong db, match với regex và không quan trọng hoa thường ($options: 'i)
    formatQueries.title = { $regex: queries.title, $options: 'i'};
  }

  // Tạo câu truy vấn
  let queryCommand = BlogCategory.find(formatQueries);

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

  // pagination
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || process.env.LIMIT_RECORDS;
  let skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  // execute query
  const result = await queryCommand.exec()
                          .then( async (response) => {
                            let counts = await BlogCategory.find(formatQueries).countDocuments();
                            return {
                              success: true,
                              code: 200,
                              devMsg: "",
                              userMsg: "",
                              data: response,
                              counts: counts
                            }
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
 * Cập nhật danh mục bài viết theo id
 * @param {*} bcid id danh mục bài viết mới
 * @param {*} blogCategory danh mục bài viết cập nhật
 * @returns {Object} {
 *  success: true - thành công, 
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: blog category updted
 * }
 * @exception {BaseError} {
 *    success: false,
 *    code: 404/400,
 *    devMsg: "",
 *    userMsg: ""
 *  }
 * Author: PMChien (03/05/2024)
 */
const updateBlogCategoryById = async (bcid, blogCategory) => {
  let blogCategoryInDb = await BlogCategory.findById(bcid);
  if(!blogCategoryInDb) {
    throw new BaseError(
      false,
      404,
      "findById return null.",
      ""
    );
  }
  else {
    let conflictBlogCategory = await BlogCategory.find({title: blogCategory.title, _id: {$ne : bcid}});
    if(conflictBlogCategory.length === 0) {
      // không dùng destructuring và spread để cập nhật vì sẽ làm mất phương thức .save();
      blogCategoryInDb.set(blogCategory);
      await blogCategoryInDb.save(); // phải có await nếu không sẽ bị pending
      return {
        success: true,
        code: 200,
        devMsg: "",
        userMsg: "Cập nhật danh mục bài viết thành công.",
        data: blogCategoryInDb
      };
    }
    else {
      throw new BaseError( false, 400, "title bị trùng.", "Tên danh mục bài viết đã tồn tại.");
    }
  }
}

/**
 * Xóa danh mục bài viết theo id
 * @param {*} bcid id của danh mục bài viết cần xóa
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: deleted blog category
 * }
 * Author: PMChien (03/05/2024)
 */
const deleteBlogCategoryById = async (bcid) => {
  let deletedBlogCategory = await BlogCategory.findByIdAndDelete(bcid);
  return {
    success: deletedBlogCategory ? true : false,
    code: deletedBlogCategory ? 200 : 404,
    devMsg: deletedBlogCategory ? "Xóa thành công." : "findByIdAndDelete return null.",
    userMsg: deletedBlogCategory ? `Xóa danh mục ${deletedBlogCategory.title} thành công.` : "Đã có lỗi xảy ra.",
    data: deletedBlogCategory
  }
}

module.exports = {
  createBlogCategory,
  getBlogCategoryById,
  getBlogCategories,
  updateBlogCategoryById,
  deleteBlogCategoryById
}