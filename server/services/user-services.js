const User = require("../models/user.js");
const BaseError = require("../exception/base-error.js");
const { isValidObjectId } = require("../ultis/helper.js") 

// API CREATE
/**
 * Service đăng kí admin
 * @param {*} email Email của người dùng
 * @param {*} password Mật khẩu
 * @param {*} firstName Tên
 * @param {*} lastName Họ
 * @param {*} mobile Số điện thoại
 * @returns { object } {
 *  success: true - thành công,
 *  code: 201 - thành công/ 500 - thất bại,
 *  devMsg: - thông điệp cho msg,
 *  userMsg: - thông điệp user,
 *  data: - admin - nếu thành công,
 * }
 * Author: PMChien (24/04/2024)
 */
const registerAdmin = async (email, password, firstName, lastName, mobile) => {
  if (!email || !password || !lastName || !firstName || !mobile) {
    throw new BaseError(
      false,
      400,
      "Thiếu thông tin.",
      "Vui lòng nhập đầy đủ thông tin."
    );
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
    const response = await User.create({
      email,
      password,
      firstName,
      lastName,
      mobile,
      role: 'admin'
    });
    if (response) {
      const newAdmin = await User.findById(response._id).select("-password -refreshToken");
      return {
        success: true,
        code: 201,
        devMsg: "Tạo thành công.",
        userMsg: "Đăng ký thành công.",
        data: newAdmin,
      };
    } else {
      return {
        success: false,
        code: 500,
        devMsg: "user = null.",
        userMsg: "Đăng ký không thành công thành công.",
        data: response,
      };
    }
  }
}

// API READ
/**
 * Hàm lấy tất cả user trong DB
 * @returns users - mảng các user
 * Author: PMChien (24/04/2024) 
 */
const getUsers = async () => {
  // lấy tất cả người dùng bỏ các trường password, role, refreshToken
  let users = await User.find().select('-password -role -refreshToken');
  return users;
}

/**
 * Lấy user theo id
 * @param {*} id id của user
 * @returns {object} {
 *    success: true - thành công,
 *    code: 200 - thành công/404 - thất bại,
 *    devMsg: "",
 *    userMsg: "",
 *    data: user
 * }
 * Author: PMChien (24/04/2024)
 */
const getUserById = async (id) => {
  let user = await User.findById(id).select('-password -role -refreshToken');
  return {
    success: user ? true : false,
    code: user ? 200 : 404,
    devMsg: user ? "Thành công." : "user = null",
    userMsg: user ? "" : "Không tìm thấy người dùng.",
    data: user
  };
}

// API DELETE
/**
 * Xóa người dùng theo id
 * @param {*} userId id của user
 * @returns {object} {
 *  success: true - xóa thành công,
 *  code: 200 / 404,
 *  devMsg: "",
 *  userMsg: "",
 * }
 */
const deleteUserById = async(userId) => {
  // findByIdAndDelete sẽ tìm và xóa theo id truyền vào, trả về dữ liệu bản ghi trước khi xóa
  let user = await User.findByIdAndDelete(userId);
  return {
    success: user ? true : false,
    code: user ? 200 : 404,
    devMsg: user ? "Delete successfully" : "findByIdAndDelete -> user === null",
    userMsg: user ? `Xóa người dùng ${user.firstName} ${user.lastName} thành công.` : "Xóa người dùng không thành công."
  }
} 

//API UPDATE
/**
 * Cập nhật người dùng theo id
 * @param {*} id id của người dùng
 * @param {*} userData thông tin cập nhật
 * @returns {object} { 
 *    success: true - thành công,
 *    code: 200/500,
 *    devMsg: "",
 *    userMsg: "",
 * }
 * Author: PMChien (25/04/2024)
 */
const updateUserById = async (id, userData) => {
  let { email, mobile } = userData;
  if(!email) {
    throw new BaseError(
      false, 
      400,
      "Email = null.",
      "Vui lòng nhập email."
    )
  }
  else {
    let userConflictEmail = await User.findOne({ email, _id: { $ne : id } });
    if(userConflictEmail) {
      throw new BaseError(
        false,
        400,
        "Email đã có trong db.",
        "Email đã tồn tại trong hệ thống."
      );
    }

    let userConflictMobile = await User.findOne( { mobile, _id: { $ne: id }});
    if(userConflictMobile) {
      throw new BaseError(
        false,
        400,
        "Mobile đã có trong db.",
        "Số điện thoại đã tồn tại trong hệ thống."
      );
    }

    let { firstName, lastName, cart, address, wishList, isBlocked } = userData;
    let newUserInfo = await User.findByIdAndUpdate(
      id,
      { 
      firstName, 
      lastName,
      email,
      mobile,
      cart,
      address,
      wishList,
      isBlocked
     },
     { new: true }
    );
    return {
      success: newUserInfo ? true : false,
      code: newUserInfo ? 200 : 500,
      devMsg: newUserInfo ? "update thành công." : "newUserInfo = null.",
      userMsg: newUserInfo ? "Cập nhật thông tin thành công." : "Đã xảy ra lỗi."
    }
  }
}

/**
 * Cập nhật giỏ hàng theo option
 * @param {ObjectId} userId id của người dùng
 * @param {ObjectId} productId id của sản phẩm
 * @param {Number} quantity số lượng thay đổi ( số nguyên dương)
 * @param {String} color Màu sắc sản phẩm
 * @param {String} option Hành động với sản phẩm "add" - thêm, "delete" - xóa
 * @returns {Object} {
 *  success: true - thành công,
 *  code: 200,
 *  devMsg: "",
 *  userMsg: "",
 *  data: user sau khi cập nhật
 * }
 * Author: PMChien (21/05/2024)
 */
const updateCart = async (userId, productId, quantity, color, option) => {
  if(!userId) {
    throw new BaseError(false, 400, "!userId.", "Đã xảy ra lỗi.");
  }
  else {
    let isValidId = isValidObjectId(userId);
    if(!isValidId) {
      throw new BaseError(false, 400, "userId không phải ObjectId.", "");
    }
  }
  if(!productId) {
    throw new BaseError(false, 400, "!productId.", "Đã xảy ra lỗi.");
  }
  if(!quantity) {
    throw new BaseError(false, 400, "!quantity.", "Đã xảy ra lỗi.");
  }
  if(!color) {
    throw new BaseError(false, 400, "!color.", "Đã xảy ra lỗi.");
  }
  let user = await User.findById(userId);
  if(!user) {
    throw new BaseError(false, 404, "Không tìm thấy user theo userId.", "");
  }
  let isExistProductArray = user.cart?.filter(item => item.product.toString() === productId);
  // nếu chưa có sản phẩm productId trong giỏ hàng
  if(isExistProductArray.length === 0) {
    if(option === 'add') {
      user.cart.push({ product: productId, quantity, color});
      await user.save();
      const { password, passwordChangedAt, refreshToken, ...userData } = user.toObject();
      return {
        success: true,
        code: 200,
        devMsg: "Thêm sản phẩm thành công.",
        userMsg: "Đã thêm vào giỏ hàng.",
        data: userData
      }
    }
  }
  // Nếu đã có productId trong giỏ hàng
  else {
    // kiểm tra xem đã có sản phẩm có màu là color chưa
    let duplicateColorInCart = isExistProductArray.find(item => item.color === color);
    // Nếu đã có màu trùng
    if(duplicateColorInCart) {
      if(option === 'add') {
        user.cart.forEach(item => {
          if(item.product.toString() === productId && item.color === color) {
            item.quantity += quantity * 1;
          }
        });
        await user.save();
        const { password, passwordChangedAt, refreshToken, ...userData } = user.toObject();
        return {
          success: true,
          code: 200,
          devMsg: "Thêm sản phẩm thành công.",
          userMsg: "Đã thêm vào giỏ hàng.",
          data: userData
        }
      }
      if(option === 'delete') {
        user.cart.forEach(item => {
          if(item.product.toString() === productId && item.color === color) {
            item.quantity -= quantity * 1;
            item.quantity = item.quantity > 0 ? item.quantity : 0;
          }
        });
        let newCart = user.cart.filter(item => item.quantity > 0);
        user.cart = newCart;
        await user.save();
        const { password, passwordChangedAt, refreshToken, ...userData } = user.toObject();
        return {
          success: true,
          code: 200,
          devMsg: "Xóa sản phẩm thành công.",
          userMsg: "Đã xóa.",
          data: userData
        }
      }
    }
    else {
      if(option === 'add') {
        user.cart.push({ product: productId, quantity, color});
        await user.save();
        const { password, passwordChangedAt, refreshToken, ...userData } = user.toObject();
        return {
          success: true,
          code: 200,
          devMsg: "Thêm sản phẩm thành công.",
          userMsg: "Đã thêm vào giỏ hàng.",
          data: userData,
        }
      }
    }
  }
}

module.exports = {
  getUsers,
  getUserById,
  registerAdmin,
  deleteUserById,
  updateUserById,
  updateCart
}