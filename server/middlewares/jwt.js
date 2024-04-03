const jwt = require('jsonwebtoken');

/**
 * Hàm tạo AccessTokem
 * @param {string} userId id của user
 * @param {String} role quyền của user
 * @returns AccessToken
 * Author:
 */
const generateAccessToken = (userId, role) => {
  try {
    return jwt.sign(
      {_id: userId, role},
      process.env.JWT_SECRET, 
      { expiresIn: '3d'}
      );
  } catch (error) {
    console.error("Đã có lỗi: ", error);
  }
}

module.exports = {
  generateAccessToken
}