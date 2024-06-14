const Blog = require("../models/blog");
const BaseError = require("../exception/base-error");
const regex = require("../resources/regex");

/**
 * Thêm một bài viết mới
 * @param {*} blog đối tượng bài viết mới cần thêm
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 201/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: created blog
 * }
 * Author: PMChien (03/05/2024)
 */
const createBlog = async (blog) => {
  let createResult = await Blog.create(blog);
  return {
    success: createResult ? true : false,
    code: createResult ? 201 : 500,
    devMsg: createResult ? "" : "create blog return null.",
    userMsg: createResult
      ? "Thêm bài viết thành công."
      : "Thêm bài viết không thành công.",
    data: createResult,
  };
};

/**
 * Lấy một bài viết theo Id
 * @param {ObjectId} bid id của blog
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/404
 *  devMsg: "",
 *  userMsg: "",
 *  data: blog by id
 * }
 * Author: PMChien (06/05/2024)
 */
const getBlogById = async (bid) => {
  const userInBlogViewFields = "_id firstName lastName email mobile role";
  // Thực hiện tìm kiếm theo id và tăng số lượt xem (numberView) lên 1
  let blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1}}, { new: true})
                       .populate("likes", userInBlogViewFields)
                       .populate("dislikes", userInBlogViewFields);
  return {
    success: blog ? true : false,
    code: blog ? 200 : 404,
    devMsg: blog ? "" : "findById return null.",
    userMsg: blog ? "" : "Đã xảy ra lỗi.",
    data: blog,
  };
};

/**
 * Lấy tất cả blog theo từ khóa tìm kiếm title, sort, pagination, fields limit
 * @param {request} req request từ client
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200,
 *  devMsg: ""
 *  userMsg: "",
 *  data: all blogs,
 *  counts: total of blog (search, sort, limit fields)
 * }
 * Author: PMChien (06/05/2024)
 */
const getBlogs = async (req) => {
  // tạo queries mới từ req.query
  let queries = { ...req.query };
  // Tách các trường đặc biệt khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((item) => delete queries[item]);

  // format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    regex.RegexFilterSorting,
    (matchEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  // searching
  if (req.query?.title) {
    formatedQueries.title = { $reges: queries.title, $options: "i" };
  }
  let queryCommand = Blog.find(formatedQueries);

  // sorting
  if (req.query?.sort) {
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

  // paging
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || process.env.LIMIT_RECORDS;
  let skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);
  
  // thêm populate
  const userInBlogViewFields = "_id firstName lastName email mobile role";
  queryCommand = queryCommand.populate("likes", userInBlogViewFields).populate("dislikes", userInBlogViewFields);

  // execute query
  let result = await queryCommand.exec()
                                  .then( async (response) => {
                                    let counts = await Blog.find(formatedQueries).countDocuments();
                                    return {
                                      success: true,
                                      code: 200,
                                      devMsg: "",
                                      userMsg: "",
                                      data: response,
                                      counts: counts
                                    };
                                  })
                                  .catch((error) => {
                                    throw new BaseError(
                                      false,
                                      500,
                                      error.message,
                                      ""
                                    );
                                  })
  return result;
};

/**
 * Cập nhật thông tin bài viết
 * @param {*} bid id của blog cần update
 * @param {*} blog thông tin blog cần update
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: updated blog
 * }
 * Author: PMchien (03/05/2024)
 */
const updateBlogById = async (bid, blog) => {
  let blogInDb = await Blog.findById(bid);
  if (blogInDb) {
    blogInDb.set(blog);
    await blogInDb.save();
    
    return {
      success: true,
      code: 200,
      devMsg: "",
      userMsg: "Cập nhật bài viết thành công.",
      data: blogInDb,
    };
  } else {
    throw new BaseError(
      false,
      400,
      "Blog.findById return null.",
      "Đã có lỗi xảy ra."
    );
  }
};

/**
 *
 * @param {*} bid id của bài viết cần xóa
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200 / 404
 *  devMsg: "",
 *  userMsg: "",
 *  data: deleted blog
 * }
 * Author: PMChien (03/05/2024)
 */
const deleteBlogById = async (bid) => {
  let result = await Blog.findByIdAndDelete(bid);
  return {
    success: result ? true : false,
    code: result ? 200 : 404,
    devMsg: result ? "Xóa thành công." : "findByIdAndDelete return null.",
    userMsg: result ? ` Xóa bài viết thành công` : "Xóa bài viết thất bại",
    data: result,
  };
};

/**
 * Nếu người dùng chưa like bài viết
 *    - Nếu người dùng dislike => chuyển sang like
 *    - Nếu không like và không dislike => like
 * Nếu người dùng đã like : xóa like
 * @param {ObjectId} userId id của người dùng
 * @param {import("mongoose").ObjectId} blogId id bài viết
 * @returns {Object} {
 *  success: true - thành công/ false - thất bại,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: blog đã được cập nhật
 * }
 * Author: PMChien (07/05/2024)
 */
const likeBlog = async (userId, blogId) => {
  const blog = await Blog.findById(blogId);
  if(!blog) {
    return {
      success: false,
      code: 404,
      devMsg: "Blog.findById return null.",
      userMsg: "Không tìm thấy bài viết."
    }
  }
  // Tìm phần tử userId trong blog.likes
  const index = blog.likes.indexOf(userId);
  // Nếu có
  if(index !== -1) {
    // xóa userId khỏi blog.likes
    blog.likes.splice(index, 1);
  }
  // Nếu chưa like
  else {
    // Tìm xem user có đang dislike không
    const indexInDislikes = blog.dislikes.indexOf(userId);
    // Nếu có
    if(indexInDislikes !== -1) {
      blog.dislikes.splice(indexInDislikes, 1); // xóa dislike
      blog.likes.push(userId); // thêm vào blog.likes
    }
    else {
      blog.likes.push(userId);
    }
  }
  await blog.save();
  const userInBlogViewFields = "_id firstName lastName email mobile role";
  await blog.populate("likes", userInBlogViewFields);
  await blog.populate("dislikes", userInBlogViewFields);
  return {
    success: true,
    code: 200,
    devMsg: "",
    userMsg: "",
    data: blog
  }
}

/**
 * Nếu người dùng chưa dislike bài viết
 *    - Nếu người dùng like => chuyển sang dislike
 *    - Nếu không like và không dislike => dislike
 * Nếu người dùng đã dislike : xóa like
 * @param {ObjectId} userId id của người dùng
 * @param {import("mongoose").ObjectId} blogId id bài viết
 * @returns {Object} {
 *  success: true - thành công/ false - thất bại,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: blog đã được cập nhật
 * }
 * Author: PMChien (07/05/2024)
 */
const dislikeBlog = async (userId, blogId) => {
  const blog = await Blog.findById(blogId);
  if(!blog) {
    return {
      success: false,
      code: 404,
      devMsg: "Blog.findById return null.",
      userMsg: "Không tìm thấy bài viết."
    }
  }
  // Tìm phần tử userId trong blog.dislikes
  const index = blog.dislikes.indexOf(userId);
  // Nếu có
  if(index !== -1) {
    // xóa userId khỏi blog.dislikes
    blog.dislikes.splice(index, 1);
  }
  // Nếu chưa dislike
  else {
    // Tìm xem user có đang like không
    const indexInLikes = blog.likes.indexOf(userId);
    // Nếu có
    if(indexInLikes !== -1) {
      blog.likes.splice(indexInLikes, 1); // xóa like
      blog.dislikes.push(userId); // thêm vào blog.dislikes
    }
    else {
      blog.dislikes.push(userId);
    }
  }
  await blog.save();
  const userInBlogViewFields = "_id firstName lastName email mobile role";
  await blog.populate("likes", userInBlogViewFields);
  await blog.populate("dislikes", userInBlogViewFields);
  return {
    success: true,
    code: 200,
    devMsg: "",
    userMsg: "",
    data: blog
  }
}

/**
 * Tải ảnh của bài viết lên
 * @param {ObjectId} blogId id của bài viết
 * @param {Object} file file ảnh trả về từ cloudinary
 * @returns {Object} {
 *  success: true,
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: updated blog
 * }
 * Author: PMChien (15/05/2024)
 */
const uploadImage = async (blogId, file) => {
  if(Object.keys(file).length === 0 ) {
    throw new BaseError (false, 400, "Không tìm thấy file ảnh.", "Không tìm thấy file ảnh.");
  }
  let blogInDb = await Blog.findById(blogId);
  if(!blogInDb) {
    throw new BaseError( false, 404, "Không tìm thấy bài viết.", "Không tìm thấy bài viết.");
  }
  blogInDb.image = file.path;
  await blogInDb.save();
  return {
    success: true,
    code: 200,
    devMsg: "",
    userMsg: "",
    data: blogInDb
  }
}

module.exports = {
  createBlog,
  getBlogById,
  getBlogs,
  updateBlogById,
  deleteBlogById,
  likeBlog,
  dislikeBlog,
  uploadImage
};
