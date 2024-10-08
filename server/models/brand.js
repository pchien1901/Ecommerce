const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
    // Tên của brand
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    // product category mà brand có
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory'
    }]
}, {
  timestamps: true
});

//Export the model
module.exports = mongoose.model('Brand', brandSchema);