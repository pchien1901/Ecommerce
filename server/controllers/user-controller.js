const User = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const BaseError = require("../exception/base-error.js");
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt.js");
const sendMail = require('../ultis/send-mail.js');
const crypto = require('crypto');
const userServices = require("../services/user-services.js");

/**
 * Hàm đăng ký tài khoản
 * Author: PMChien (02/04/2024)
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  if (!email || !password || !lastName || !firstName || !mobile) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: "Thiếu thông tin.",
      userMsg: "Vui lòng nhập đầy đủ thông tin.",
    });
  }

  const user = await User.findOne({ $or: [{ email }, { mobile }]});
  if (user) {
    if(user.email === email) {
      throw new BaseError(
        false,
        400,
        "Email bị trùng trong DB.",
        "Email đã tồn tại trên hệ thống."
      );
    }
    else {
      throw new BaseError(
        false,
        400,
        "Số điện thoại bị trùng trong DB.",
        "Số điện thoại đã tồn tại trên hệ thống."
      );
    }
  } else {
    const response = await User.create(req.body);
    if (response) {
      const newUser = await User.findById(response._id).select("-password -refreshToken");
      return res.status(201).json({
        success: true,
        code: 201,
        devMsg: "Tạo thành công.",
        userMsg: "Đăng ký thành công.",
        data: newUser,
      });
    } else {
      return res.status(500).json({
        success: false,
        code: 500,
        devMsg: "user = null.",
        userMsg: "Đăng ký không thành công thành công.",
        data: response,
      });
    }
  }
});

/**
 * Đăng ký admin
 * Author: PMChien (24/04/2024)
 */
const registerAdmin = asyncHandler(async (req, res) => {
  let { email, password, firstName, lastName, mobile } = req.body;
  let createAdminResult = await userServices.registerAdmin(email, password, firstName, lastName, mobile);
  if( createAdminResult?.success ) {
    return res.status(201).json(createAdminResult);
  }
  else {
    return res.status(500).json(createAdminResult);
  }
});

/**
 * Đăng nhập
 * Author:
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: "Email là bắt buộc",
      userMsg: "Vui lòng nhập email để tiếp tục.",
    });
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: "Password là bắt buộc",
      userMsg: "Vui lòng nhập password để tiếp tục.",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    let checkPassword = await user.isCorrectPassword(password);
    if (checkPassword) {
      // tách password, role bằng destructuring
      let { password, role, refreshToken, ...userData } = user.toObject(); // đổi user về json bằng toObject()
      /**
       *  tạo accesstoken và refreshToken
       * refreshToken: cấp mới accessToken
       * accessToken: Xác thực và phân quyền người dùng
       *  */
      let accessToken = generateAccessToken(userData._id, role);
      let newRefreshToken = generateRefreshToken(user._id);
      // update refreshToken vào DB, tùy chọn { new: true } để trả về bản ghi đã cập nhật
      await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true} );
      // lưu refreshToken vào cookies
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7*24*60*60*1000 })
      return res.status(200).json({
        success: true,
        code: 200,
        devMsg: "Đăng nhập thành công.",
        userMsg: "",
        data: userData, // trong userData không có refreshToken vì đã lưu ở cookies
        accessToken: accessToken,
      });
    } else {
      throw new BaseError(
        false,
        400,
        "Sai mật khẩu.",
        "Mật khẩu chưa chính xác."
      );
    }
  } else {
    throw new BaseError(
      false,
      400,
      "Không tìm thấy người dùng.",
      "Vui lòng kiểm tra lại Email."
    );
  }
});

/**
 * lấy user có id hiện tại
 */
const getCurrent = asyncHandler( async (req, res) => {
  // vì ở verifyAccessToken khi token hợp lệ thì decode = id được gán cho user
  const { _id } = req.user;
  // dùng select để chọn key muốn lấy, nếu không muốn key nào thì dùng dấu - phía trước
  const user = await User.findById(_id).select('-refreshToken -password -role');
  
  return res.status(200).json({
    success: true,
    code: 200,
    devMsg: "",
    userMsg: "",
    data: user ? user : "user not found."
  })
});

/**
 * Làm mới access token
 * Author
 */
const refreshAccessToken = asyncHandler( async (req, res) => {
  // lấy cookie từ request
  const cookie = req.cookies;
  // nếu không có cookie hoặc trong cookie không có refreshToken thì đưa ra lỗi 401
  if(!cookie && !cookie.refreshToken) {
    throw new BaseError(
      false,
      401,
      "Không có refreshToken.",
      "Không được ủy quyền để thực hiện."
    )
  }
  // Check xem token có hợp lệ hay không
  try {
    let decode = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    let user = await User.findOne({ _id: decode._id, refreshToken: cookie.refreshToken });
    if(!user) {
      // không tìm thấy user => không có _id hoặc không có refreshToken phù hợp
      return res.status(401).json({
        success: false,
        code: 401,
        devMsg: "Không tìm thấy user theo _id hoặc refresh token có vấn đề.",
        userMsg: "Vui lòng đăng nhập lại để sử dụng dịch vụ.",
      });
    }
    else {
      // có user => cập nhật accessToken và refreshToken
      let newAccessToken = generateAccessToken(user._id, user.role);
      let newRefreshToken = generateRefreshToken(user._id);
      // cập nhật refreshToken trong DB
      await User.updateOne({ _id: user._id }, { $set: {refreshToken: newRefreshToken }});
      return res.status(200).json({
        success: true,
        code: 200,
        devMsg: "Cập nhật access token và refresh token.",
        userMsg: "",
        data: {
          accessToken: newAccessToken
        }
      });
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi trong lúc giải mã refreshToken: ", error);
    return res.status(401).json({
      success: false,
      code: 401,
      devMsg: "Giải mã refresh Token không thành công - refresh token hết hạn.",
      userMsg: "Vui lòng đăng nhập lại để sử dụng dịch vụ.",
    })
  }
});

/**
 * Hàm đăng xuất và xóa refresh token trong cookies
 * Author:
 */
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if(!cookie || !cookie.refreshToken) {
    throw new BaseError(
      false,
      401,
      "Không tìm thấy cookies hoặc refresh token trong cookies.",
      "Vui lòng đăng nhập để sử dụng dịch vụ."
    );
  }
  // xóa refresh token trong DB
  await User.findOneAndUpdate({ refreshToken: cookie.refreshToken}, { refreshToken: ''}, { new: true });
  // xóa refresh token tron cookies trình duyệt
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true
  });
  return res.status(200).json({
    success: true,
    code: 200,
    devMsg: "Đăng xuất thành công, đã xóa refresh token trong cookies.",
    userMsg: ""
  });
});

/**
 * Chức năng quên mật khẩu
 *  Client: gửi email để nhận otp
 *  Server: + Check email có hợp lệ không
 *          + Gửi mail + link ( trong link có password change token )
 *  Client check mail => click vào link
 *  Client gửi api kèm token và password
 *  Check token có giống token server đã gửi mail không
 *  Change password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if( !email ) {
    throw new BaseError(
      false,
      404,
      "Không thấy email ở req.query.",
      "Vui lòng kiểm tra lại email."
    );
  }

  const user = await User.findOne({ email });
  if( !user ) {
    throw new BaseError(
      false,
      404,
      "Email không chính xác, không tìm được user trong DB.",
      "Email chưa chính xác, xin hãy kiểm tra lại."
    );
  }
  const resetToken = user.createPasswordChangedToken();
  await user.save(); // lưu vào DB
  // nxqo epjt xkmv mkzz
  const html = `Xin vui lòng click vào đường dẫn dưới đây để thay đổi mật khẩu (đường dẫn sẽ hết hạn sau 15 phút sau khi gửi). <br> 
  <a href="${process.env.URL_SERVER}/api/v1/user/reset-password/${resetToken}">Click here</a>`;
  

  const result = await sendMail(email, html);
  try {
  } catch (error) {
    console.log("Đã xảy ra lỗi khi gửi mail: ", error);
  }
  return res.status(200).json({
    success: true,
    code: 200,
    devMsg: "",
    userMsg: "",
    data: result
  }); 
});

/**
 * Chức năng reset mật khẩu
 * Client: gửi request PUT method có body gồm:
 *    + password - mật khẩu mới
 *    + token - reset token được server gửi trong mail
 * hash token và tìm trong Db có user có resetToken không, nếu có kiểm tra thời gian hết hạn token
 * token hợp lệ => đổi mật khẩu = password
 * Trả về mã 200
 * Các ngoại lệ: 
 *      
 */
const resetPassword = asyncHandler( async (req, res) => {
  const { password, token } = req.body;
  console.log(req.body);
  if(!password) {
    throw new BaseError(
      false,
      400,
      "Không tìm thấy password.",
      "Vui lòng nhập mật khẩu."
    );
  }
  if(!token) {
    throw new BaseError(
      false,
      400,
      "Không tìm thấy token trong body.",
      "Đã xảy ra lỗi."
    )
  }
  const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  // Tìm user trùng passwordResetToken và thời gian hết hạn
 // passwordResetToken
  const user = await User.findOne(
    {
      passwordResetToken, 
      // passwordResetExpires: {$gt : Date.now()} // thời gian hết hạn lớn hơn hiện tại
    });

  if(!user) {
    throw new BaseError(
      false,
      400,
      "Không tìm thấy user dựa trên resetPasswordToken đã gửi",
      "Đã xảy ra lỗi, vui lòng thử lại sau.",
    )
  }
  else {
    console.log(user);
    if(user.passwordResetExpires < Date.now()) {
      throw new BaseError(
        false,
        400,
        "passwordResetExpires quá hạn.",
        "Đã hết thời gian chờ, vui lòng thử lại."
      )
    }
    else {
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordChangedAt = Date.now();
      user.passwordResetExpires = undefined;
      await user.save();
      return res.status(200).json({
        success: true,
        code: 200,
        devMsg: "Cập nhật mật khẩu thành công.",
        userMsg: "Cập nhật mật khẩu thành công."
      });
    }
  }
})

/**
 * Controller lấy tất cả user
 * Author: PMChien (24/02/2024)
 */
const getUsers = asyncHandler( async (req, res) => {
  let users = await userServices.getUsers();
  return res.status(200).json({
    success: true,
    code: 200,
    devMsg: "",
    userMsg: "",
    data: users
  });
});

/**
 * Lấy người dùng theo id
 * Author: PMChien (24/04/2024)
 */
const getUserById = asyncHandler( async (req, res) => {
  let { id } = req.params;
  let queryResult = await userServices.getUserById(id);
  if(queryResult?.success) {
    return res.status(200).json(queryResult);
  }
  else {
    return res.status(404).json(queryResult);
  }
});

/**
 * Xóa người dùng theo id
 * Author: PMChien (24/04/2024)
 */
const deleteUserById = asyncHandler( async (req, res)=>{
  let { id } = req.params;
  let deleteResult = await userServices.deleteUserById(id);
  if(deleteResult?.success) {
    return res.status(200).json(deleteResult);
  }
  else {
    return res.status(404).json(deleteResult);
  }
});

/**
 * Cập nhật thông tin người dùng theo id
 */
const updateUserById = asyncHandler( async(req, res) => {
  let { id } = req.params;
  let userData = req.body;
  let updateResult = await userServices.updateUserById(id, userData);
  if(updateResult?.success) {
    return res.status(200).json(updateResult);
  }
  else {
    return res.status(500).json(updateResult);
  }
});

module.exports = {
  register,
  registerAdmin,
  login,
  logout,
  getCurrent,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById
};
