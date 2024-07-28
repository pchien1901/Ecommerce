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
      {_id: userId, role}, // payload
      process.env.JWT_SECRET, // secret
      { expiresIn: '10m'} // option
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
      {_id: userId}, // payload
      process.env.JWT_SECRET, // secret
      { expiresIn: '120m'} // option
      );
  } catch (error) {
    console.error("Đã xảy ra lỗi: ", error);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
}