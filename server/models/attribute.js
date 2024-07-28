const mongoose = require("mongoose"); // Erase if already required
const { Schema } = mongoose;
/**
 * Các thuộc tính sản phẩm.
 */
var attributeSchema = new Schema({
  label: String,
  value: String,
});

module.exports = attributeSchema;