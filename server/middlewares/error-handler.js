/**
 * Xử lí khi không tìm được route
 * Author: PMChien
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
}

/**
 * 
 * @param {*} BaseError 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const baseErrorHandler = (BaseError, req, res, next) => {
  console.log(BaseError);
  switch (BaseError) {
    case 200:
      return res.status(500).json({
        success: BaseError.success,
        code: 500,
        devMsg: BaseError.devMsg,
        userMsg: BaseError.userMsg
      })
      break;
  
    default:
      return res.status(BaseError.code).json({
        success: BaseError.success,
        code: BaseError.code,
        devMsg: BaseError.devMsg,
        userMsg: BaseError.userMsg
      })
      break;
  }
}

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
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(status).json({
    success: false,
    code: status,
    devMsg: error?.message,
    userMsg: "Đã xảy ra lỗi",
    error: error,
  });
}


module.exports = {
  notFound,
  errorHandler,
  baseErrorHandler,
}