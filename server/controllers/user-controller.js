const User = require('../models/user.js');
const asyncHandler = require('express-async-handler');
const BaseError = require('../exception/base-error.js');
const { generateAccessToken } = require('../middlewares/jwt.js');

/**
 * Hàm đăng ký tài khoản
 * Author: PMChien (02/04/2024)
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
    if(!email || !password || !lastName || !firstName) {
      return res.status(400).json({
        success: false,
        code: 400,
        devMsg: "Thiếu thông tin.",
        userMsg: "Vui lòng nhập đầy đủ thông tin."
      });
    }

    const user = await User.findOne({ email });
    if(user) {
      throw new Error("Email has existed");
    }
    else {
      const response = await User.create(req.body);
      if (response) {
        return res.status(201).json({
          success: true,
          code: 201,
          devMsg: "Tạo thành công.",
          userMsg: "Đăng ký thành công.",
          data: response
        });
      }
      else {
        return res.status(500).json({
          success: false,
          code: 500,
          devMsg: "user = null.",
          userMsg: "Đăng ký không thành công thành công.",
          data: response
        });
      }
    }
    

});

/**
 * Đăng nhập
 * Author:
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if(!email) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: "Email là bắt buộc",
      userMsg: "Vui lòng nhập email để tiếp tục."
    });
  }
  if(!password) {
    return res.status(400).json({
      success: false,
      code: 400,
      devMsg: "Password là bắt buộc",
      userMsg: "Vui lòng nhập password để tiếp tục."
    });
  }

  const user = await User.findOne({ email });
  if(user) {
    let checkPassword = await user.isCorrectPassword(password);
    if(checkPassword) {
      let { password, role, ...userData} = user.toObject();// đổi user về json bằng toObject()
      let accessToken = generateAccessToken(userData._id, role);
      return res.status(200).json({
        success: true,
        code: 200,
        devMsg: "Đăng nhập thành công.",
        userMsg: "",
        data: userData,
        accessToken: accessToken,
      });
    }
    else {
      throw new BaseError(
        false,
        400,
        "Sai mật khẩu.",
        "Mật khẩu chưa chính xác."
      )
    }
  }
  else {
    throw new BaseError(
      false,
      400,
      "Không tìm thấy người dùng.",
      "Vui lòng kiểm tra lại Email."
    )
  }
});

module.exports = {
  register,
  login
}