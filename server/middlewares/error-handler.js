const BaseError = require("../exception/base-error.js");

/**
 * Xử lí khi không tìm được route
 * Author: PMChien
 */
const notFound = (req, res, next) => {
  res.status(404);
  //const error = new Error(`Route ${req.originalUrl} not found`);
  const baseError = new BaseError(
    false,
    404,
    ` Không tìm thấy route ${req.originalUrl},`,
    "Đã xảy ra lỗi."
  );
  //next(error);
  next(baseError);
};

/**
 *
 * @param {*} BaseError
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const baseErrorHandler = (BaseError, req, res, next) => {
  console.log("Đã xảy ra lỗi ở baseErrorHandler: ",BaseError);
  switch (BaseError.code) {
    case 200:
      return res.status(500).json({
        success: BaseError.success,
        code: 500,
        devMsg: BaseError.devMsg,
        userMsg: BaseError.userMsg,
      });
      break;

    case undefined: 
      return res.status(500).json({
        success: false,
        code: 500,
        devMsg: BaseError.message,
        userMsg: "Đã xảy ra lỗi."
      })

    default:
      if(BaseError?.code <= 500 || BaseError?.code >= 400) {
        return res.status(BaseError.code).json({
          success: BaseError.success ? BaseError.success : false,
          code: BaseError.code ? BaseError.code : 500,
          devMsg: BaseError.devMsg? BaseError.devMsg : BaseError.message,
          userMsg: BaseError.userMsg? BaseError.userMsg : "Đã xảy ra lỗi từ máy chủ.",
        });
      }
      else {
        return res.status(500).json({
          success: BaseError.success ? BaseError.success : false,
          code: BaseError.code ? BaseError.code : 500,
          devMsg: BaseError.devMsg? BaseError.devMsg : BaseError.message,
          userMsg: BaseError.userMsg? BaseError.userMsg : "Đã xảy ra lỗi từ máy chủ.",
        });
      }
      break;
  }
};

/**
 * Middleware xử lí lỗi, yêu cầu phải có đủ 4 param thì mới là xử lí lỗi
 * Nếu middleware không có bốn tham số, Express có thể không xem nó là một middleware xử lý lỗi và không gọi nó khi có lỗi xảy ra. Thêm tham số next vào errHandler
 *  giúp đảm bảo rằng nó được xem là middleware xử lý lỗi và được gọi khi cần thiết
 * @param {*} error
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * Author: PMChien
 */
const errorHandler = (error, req, res, next) => {
  console.log(res.statusCode);
  console.log("Đã xảy ra lỗi ở errorHandler: ", error);
  let status = res?.statusCode === 200 ? 500 : res?.statusCode;
  if (!status) {
    status = 500;
  }
  return res.status(status).json({
    success: false,
    code: status,
    devMsg: error?.message,
    userMsg: "Đã xảy ra lỗi",
    error: error,
  });
};

module.exports = {
  notFound,
  errorHandler,
  baseErrorHandler,
};
