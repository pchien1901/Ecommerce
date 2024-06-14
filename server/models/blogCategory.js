const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
/**
 * Schema blog category - danh mục bài viết
 */
var blogCategorySchema = new mongoose.Schema({
    // Tên danh mục bài viết
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    }
}, {
  timestamps: true
});

//Export the model
module.exports = mongoose.model('BlogCategory', blogCategorySchema);