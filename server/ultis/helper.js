//const { ObjectId } = reqire('mongodb');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Hàm kiểm tra một chuỗi có phải ObjectId trong mongodb không
 * @param {*} id chuỗi cần kiểm tra 
 * @returns {Boolean} true - là ObjectId
 */
function isValidObjectId(id) {
  if(ObjectId.isValid(id)) {
    if((String)(new ObjectId(id)) === id) {
      return true;
    }
    return false;
  }
  return false;
}

module.exports = {
  isValidObjectId
}