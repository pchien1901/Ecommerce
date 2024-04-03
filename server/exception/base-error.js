/**
 * class cho biết lỗi cơ bản gôm các trường 
 *    success: thành công/ thất bại, 
 *    code: Mã lỗi 
 *    devMsg: thông tin lỗi cho dev
 *    userMsg: thông tin lỗi cho user
 */
class BaseError extends Error {
  /**
   * Hàm khởi tạo BaseError
   * @param {f} success trạng thái true - thành công, false - thất bại
   * @param {*} code Mã lỗi
   * @param {*} devMsg Thông tin cho dev
   * @param {*} userMsg Thông tin user
   */
  constructor(success, code, devMsg, userMsg, ) {
    super(devMsg);
    this.success = success;
    this.code = code;
    this.devMsg = devMsg;
    this.userMsg = userMsg
  }
}

module.exports = BaseError;