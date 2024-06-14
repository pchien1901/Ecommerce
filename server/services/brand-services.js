const Brand = require("../models/brand");
const BaseError = require("../exception/base-error");
const regex = require("../resources/regex.js");

/**
 * Tạo mới một thương hiệu
 * @param {Object} brand thương hiệu mới cần tạo
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 201/500,
 *  devMsg: "",
 *  userMsg: "",
 *  data: result created brand
 * }
 * @exception {BaseError} {
 *  false, 400, "", ""
 * }
 * Author: PMChien (07/05/2024)
*/
const createBrand = async (brand) => {
  // Kiểm tra đã tồn tại thương hiệu chưa
  let existBrand = await Brand.findOne( { title: brand.title });
  if(existBrand) {
    throw new BaseError(
      false,
      400,
      "Brand title đã tồn tại trong db.",
      "Tên thương hiệu đã tồn tại."
    );
  }
  else {
    let result = await Brand.create(brand);
    return {
      success: result ? true : false,
      code: result ? 201 : 500,
      devMsg: result ? "" : "create(brand) return null.",
      userMsg: result ? "Tạo thương hiệu thành công." : "Tạo thương hiệu thất bại.",
      data: result
    };
  }
}

/**
 * Lấy một thương hiệu theo id
 * @param {*} brandId id của brand
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: brand cần lấy
 * }
 *  Author: PMChien (07/05/2024)
 */
const getBrandById = async (brandId) => {
  let brand = await Brand.findById(brandId);
  return {
    success: brand ? true : false,
    code: brand ? 200 : 404,
    devMsg: brand ? "" : "findById(brandId) return null.",
    userMsg: brand ? "" : "Không tìm thấy thương hiệu.",
    data: brand
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
 *  data: all brand sau search filter sort
 *  counts: tổng số bản ghi truy vấn được
 * }
 * Author: PMChien (07/05/2024)
*/
const getBrands = async (req) => {
  // Tách queries
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
  let queryCommand = Brand.find(formatQueries);

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
                            let counts = await Brand.find(formatQueries).countDocuments();
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
 * Cập nhật thương hiệu theo id
 * @param {*} brandId id thương hiệu mới
 * @param {*} brand thương hiệu cập nhật
 * @returns {Object} {
 *  success: true - thành công, 
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: brand updted
 * }
 * @exception {BaseError} {
 *    success: false,
 *    code: 404/400,
 *    devMsg: "",
 *    userMsg: ""
 *  }
 * Author: PMChien (07/05/2024)
*/
const updateBrandById = async (brandId, brand) => {
  let brandInDb = await Brand.findById(brandId);
  if(!brandInDb) {
    throw new BaseError(
      false,
      404,
      "findById return null.",
      ""
    );
  }
  else {
    let conflictBrand = await Brand.find({title: brand.title, _id: {$ne : brandId}});
    if(conflictBrand.length === 0) {
      // không dùng destructuring và spread để cập nhật vì sẽ làm mất phương thức .save();
      brandInDb.set(brand);
      await brandInDb.save(); // phải có await nếu không sẽ bị pending
      return {
        success: true,
        code: 200,
        devMsg: "",
        userMsg: "Cập nhật thương hiệu thành công.",
        data: brandInDb
      };
    }
    else {
      throw new BaseError( false, 400, "title bị trùng.", "Tên thương hiệu đã tồn tại.");
    }
  }
}

/**
 * Xóa thương hiệu theo id
 * @param {*} brandId id của thương hiệu cần xóa
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200/404,
 *  devMsg: "",
 *  userMsg: "",
 *  data: deleted brand
 * }
 * Author: PMChien (07/05/2024)
*/
const deleteBrandById = async (brandId) => {
  let deletedBrand = await Brand.findByIdAndDelete(brandId);
  return {
    success: deletedBrand ? true : false,
    code: deletedBrand ? 200 : 404,
    devMsg: deletedBrand ? "Xóa thành công." : "findByIdAndDelete return null.",
    userMsg: deletedBrand ? `Xóa danh mục ${deletedBrand.title} thành công.` : "Đã có lỗi xảy ra.",
    data: deletedBrand
  }
}

module.exports = {
  createBrand,
  getBrandById,
  getBrands,
  updateBrandById,
  deleteBrandById
}