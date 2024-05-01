const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const BaseError = require("../exception/base-error");

/**
 * Hàm xác thực token
 */
const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // kiểm tra xem có refresh token trong cookie không
  let cookie = req.cookies;
  if(!cookie || !cookie.refreshToken) {
    return res.status(401).json({
      success: false,
      code: 401,
      devMsg: "Không có cookie hoặc không thấy refreshToken trong cookies.",
      userMsg: "Vui lòng đăng nhập để sử dụng dịch vụ."
    });
  }
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    // token dạng 'Bearer token' => cắt theo dấu ' ' lấy phần tử [1] là token
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      /**
       * call back dùng để nhận xác thực token
       * @param {Error} err Lỗi khi xác thực token - nếu có
       * @param {String} decode phần trước khi được hash token {_id: userId, role}
       * @returns
       */
      (err, decode) => {
        if (err) {
          return res.status(401).json({
            success: false,
            code: 401,
            devMsg: "Invalid accessToken",
            userMsg: "Không được ủy quyền để thực hiện.",
          });
        }
        //console.log("decode: ",decode);
        req.user = decode;
        next();
      }
    );
  } else {
    return res.status(401).json({
      success: false,
      code: 401,
      devMsg: "require authenticate - không tìm thấy access token.",
      userMsg: "Không được ủy quyền để thực hiện."
    });
  }
});

/**
 * Middleware kiểm tra role của người dùng có phải 'admin' không
 * Author: PMChien (24/04/2024)
 */
const isAdmin = asyncHandler((req, res, next) => {
  // Middleware isAdmin nằm sau verifyToken nên req.user = decode 
  const { role } = req.user;
  if(role !== 'admin') {
    res.status(401).json({
      success: false,
      code: 401,
      devMsg: "role !== 'admin'",
      userMsg: "Không có quyền truy cập."
    });
  }
  else {
    next();
  }
});

module.exports = {
  verifyAccessToken,
  isAdmin
};
