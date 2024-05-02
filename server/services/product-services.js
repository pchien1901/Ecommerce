const Product = require("../models/product.js"); // import đối tượng thao tác với mongo db
const BaseError = require("../exception/base-error.js");
const slugify = require("slugify");

/**
 * Tạo sản phẩm
 * @param {object} product object chứa thông tin của product
 * @returns {object} {
 *  success: true - thành công,
 *  code: 201/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: product
 * }
 * Author: PMChien(25/04/2024)
 */
const createProduct = async (product) => {
  // nếu product không có key nào thì đưa ra lỗi 400
  if (Object.keys(product).length === 0) {
    throw new BaseError(
      false,
      400,
      "req.body === {}.",
      "Vui lòng nhập đủ các trường."
    );
  }
  if (!product.title) {
    throw new BaseError(
      false,
      400,
      "product.title === null",
      "Vui lòng nhập tiêu đề sản phẩm."
    );
  }
  // Tạo slug cho sản phẩm
  //product.slug = slugify(`${product.title} ${}`);
  let createResult = await Product.create(product);
  if(createResult) {
    createResult.slug = slugify(`${createResult.title} ${createResult._id}`);
    createResult.save();
  }
  return {
    success: createResult ? true : false,
    code: createResult ? 201 : 500,
    devMsg: createResult ? "Tạo product thành công." : "Tạo thất bại.",
    userMsg: createResult ? "Thêm sản phẩm thành công." : "Đã có lỗi xảy ra.",
    data: createResult,
  };
};

/**
 * lấy một sản phẩm theo id
 * @param {*} id id của product
 * @returns {object} {
 *  success: true - thành công,
 *  code: 200/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: product,
 * }
 * Author: PMChien(25/04/2024)
 */
const getProductById = async (id) => {
  let product = await Product.findById(id);
  return {
    success: product ? true : false,
    code: product ? 200 : 500,
    devMsg: product ? "get product by id thành công." : "product === null.",
    userMsg: product ? "" : "Đã xảy ra lỗi.",
    data: product,
  };
};

/**
 * Lấy tất cả sản phẩm, có filter, sorting, pagination
 * @param {*} req request từ client
 * Author: PMChien (01/05/2024)
 */
const getProducts = async (req) => {
  // copy query từ đường dẫn
  let queries = { ... req.query};
  
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach(item => delete queries[item]);

  // format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`);
  const formatedQueries = JSON.parse(queryString);

  // Filtering
  if(queries?.title) {
    formatedQueries.title = {$regex: queries.title, $options: 'i'}; // chỉ cần 1 số từ map với queries title thì sẽ map
    // i là không phân biệt hoa thường
  }
  let queryCommand = Product.find(formatedQueries);// không dùng await nên nó sẽ ở trạng thái pending

  // Sorting
  // Nếu query có sort
  if(req.query.sort) {
    // tách các trường bằng dấu ',' và nối bằng dấu ' '
    let sortBy = req.query.sort.split(',').join(' ');
    queryCommand =  queryCommand.sort(sortBy); // thêm điều kiện sort vào queryCommand
  }

  // Fields Limiting
  // Chỉ chọn ra các trường được chỉ định
  if(req.query.fields) {
    // Lọc các trường cần lấy, cắt theo ',' và nối bằng ' '
    let fieldsLimit = req.query.fields.split(',').join(' ');
    // chọn các trường cần lấy bằng .select()
    queryCommand = queryCommand.select(fieldsLimit);
  }

  // Pagination
  /**
   * Phân trang gồm 2 tham số
   *  - limit : số bản ghi/ documents trên trang
   *  - page: trang hiện tại
   */
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || process.env.LIMIT_PRODUCTS;
  let skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // execute query
  let result = await queryCommand.exec()
    .then( async (response) => {
      let counts = await Product.find(formatedQueries).countDocuments();
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
}

/**
 *  Cập nhật sản phẩm theo id
 * @param {*} id id của sản phẩm cần cập nhật
 * @param {*} product thông tin sản phẩm cần cập nhật
 * @returns {object} {
 *  success: true - thành công,
 *  code: 200/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: productUpdate
 * }
 * @exception {BaseError} {
 *  success: false,
 *  code: 400,
 *  devMsg: "",
 *  userMsg: ""
 * }
 * Author: PMChien (26/04/2024)
 */
const updateProductById = async(id, product) => {
  let productInDB = await Product.findById(id);
  if(productInDB) {
    if(!product.title) {
      throw new BaseError(
        false,
        400,
        "product.title === null",
        "Vui lòng nhập tên sản phẩm.",
      );
    }
    else {
      product.slug = slugify(`${product.title} ${id}`);
      let productUpdate = await Product.findByIdAndUpdate( id, product, {new: true});
      return {
        success: productUpdate ? true : false,
        code: productUpdate ? 200 : 500,
        devMsg: productUpdate ? "update successfully." : "productUpdate === null",
        userMsg: productUpdate ? "Cập nhật thông tin sản phẩm thành công." : "Đã xảy ra lỗi.",
        data: productUpdate
      }
    }
  }
  else {
    throw new BaseError(
      false,
      400,
      "id lỗi, không tìm được product trong db.",
      "Đã có lỗi xảy ra, hãy thử lại."
    );
  }
}

/**
 * xóa product theo id
 * @param {*} id id của product cần xóa
 * @returns {object} {
 *  success: true - xóa thành công,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: deletedProduct
 * }
 */
const deleteProductById = async (id) => {
  let deletedProduct = await Product.findByIdAndDelete(id);
  return {
    success: deletedProduct ? true : false,
    code: deletedProduct ? 200 : 404,
    devMsg: deletedProduct ? "Xóa thành công" : "deletedProduct === null",
    userMsg: deletedProduct ? ` Xóa sản phẩm ${deletedProduct.title} thành công.` : `Đã xảy ra lỗi.`,
    data: deletedProduct
  }
}

/**
 * Thêm đánh giá
 * @param {*} userId id người viết đánh giá
 * @param {*} productId id bài viết đánh giá
 * @param {*} star số sao cho
 * @param {*} comment nhận xét
 * @returns 
 * Author: PMChien (02/05/2024)
 */
const ratings = async (userId, productId, star, comment) => {
  const ratingProduct = await Product.findById(productId);
  if(!ratingProduct) {
    throw new BaseError(
      false,
      404,
      "Không tìm thấy product để rating.",
      "Đã xảy ra lỗi."
    );
  }
  else {
    // Tìm kiếm các rating của userId xem đã ratings chưa
    // cần chuyển el.postedBy.toString vì kiểu postedBy là objectId còn userId là string nên dùng toán tử === không được
    const alreadyRatings = ratingProduct?.ratings?.find(el => el.postedBy.toString() === userId);
    if(alreadyRatings) {
      // update star & comment
      let response = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRatings }
        }, 
        {
          $set: { "ratings.$.star" : star, "ratings.$.comment" : comment}
        },
        { new: true }
      );
      if(response.modifiedCount > 0) {
        let newProduct = await Product.findById(productId);
        let ratingsCount = newProduct.ratings.length; // tổng số đánh giá
        let sumOfStar = newProduct.ratings.reduce((sum, userRating) => sum + userRating.star * 1, 0); // tính tổng số sao 
        newProduct.totalRatings = Math.round(sumOfStar * 10 / ratingsCount) / 10; // tính số sao trung bình làm tròn 1 chữ số
        newProduct.save();
        return {
          sucess: true,
          code: 200,
          devMsg: "Cập nhật ratings thành công.",
          userMsg: "Cập nhật đánh giá thành công.",
          data: newProduct
        };
      }
      return {
        success: response ? true : false,
        code: response ? 200 : 500,
        devMsg: "",
        userMsg: "",
        data: response?.data ? response.data : response,
      }
    }
    else {
      // add star & comment
      const response = await Product.findByIdAndUpdate(
        productId,
        {
          $push: { ratings: { star, comment, postedBy: userId}},
        },
        { new: true } // dùng new : true trả về bản ghi mới
      );
      let ratingsCount = response.ratings.length;
      let sumOfStar = response.ratings.reduce((sum, userRating) => sum + userRating.star, 0);
      response = Math.round(sumOfStar * 10 / ratingsCount)/10;
      response.save();
      return {
        success: response ? true : false,
        code: response ? 200 : 500,
        devMsg: response ? "" : "Thêm ratings thất bại.",
        userMsg: response ? "Thêm đánh giá thành công." : "Thêm đánh giá thất bại.",
        data: response
      };
    }
  }
}

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProductById,
  deleteProductById,
  ratings
};
