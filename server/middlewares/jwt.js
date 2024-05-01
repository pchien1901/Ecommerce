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
      { expiresIn: '10m'}
      );
  } catch (error) {
    console.error("Đã có lỗi: ", error);
  }
}

/**
 * Hàm tạo RefreshToken
 * @param {String} userId  id của user
 * @returns RefreshToken
 * Author: 
 */
const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(
      {_id: userId},
      process.env.JWT_SECRET,
      { expiresIn: '120m'}
      );
  } catch (error) {
    console.error("Đã xảy ra lỗi: ", error);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
}