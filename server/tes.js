const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Kết nối với MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Định nghĩa schema
const objectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true, unique: true }
});

// Sử dụng plugin uniqueValidator để kiểm tra tính duy nhất của title
objectSchema.plugin(uniqueValidator);

// Tạo model
const ObjectModel = mongoose.model('Object', objectSchema);

// Hàm cập nhật hoặc thêm mới đối tượng
async function updateOrCreateObject(specificId, newTitle) {
  try {
    // Kiểm tra xem có đối tượng nào trùng id không
    const objectById = await ObjectModel.findOne({ id: specificId });

    if (objectById) {
      // Trường hợp 1: Cập nhật title nếu id tồn tại và title khác
      if (objectById.title !== newTitle) {
        objectById.title = newTitle;
        await objectById.save();
        console.log('Title đã được cập nhật.');
      }
    } else {
      // Trường hợp 3: Thêm mới nếu không có bản ghi nào có id đó
      const newObject = new ObjectModel({ id: specificId, title: newTitle });
      await newObject.save();
      console.log('Đối tượng mới đã được thêm vào.');
    }
  } catch (error) {
    if (error.code === 11000) {
      // Trường hợp 2: Thông báo lỗi nếu title bị trùng
      console.log('Thông báo: Đã tồn tại đối tượng với title này.');
    } else {
      // Xử lý các lỗi khác
      console.error(error);
    }
  }
}

// Sử dụng hàm
updateOrCreateObject('specific_id', 'new_title');