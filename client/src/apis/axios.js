import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
  });

  // Thêm một bộ đón chặn request
  instance.interceptors.request.use(function (config) {
    // Làm gì đó trước khi request dược gửi đi
    return config;
  }, function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  });

// Thêm một bộ đón chặn response
instance.interceptors.response.use(function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response.data;
  }, function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    console.error(`Đã có lỗi xảy ra : ${error}`);
    if (error.response) {
      // Có response từ server nhưng có lỗi (ngoài tầm 2xx)
      const statusCode = error.response.status;

      switch (statusCode) {
        case 400:
          console.error("Yêu cầu không hợp lệ (400).", error.response.data);
          break;
        case 401:
          console.error("Bạn chưa đăng nhập (401).");
          // Có thể thực hiện điều hướng đến trang login
          break;
        case 403:
          console.error("Bạn không có quyền truy cập (403).");
          break;
        case 500:
          console.error("Lỗi từ server (500).", error.response.data);
          break;
        default:
          console.error(`Đã có lỗi xảy ra với mã trạng thái: ${statusCode}`, error.response.data);
      }
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không có phản hồi
      console.error("Không có phản hồi từ server.", error.request);
    } else {
      // Một lỗi xảy ra trong quá trình cài đặt request
      console.error("Lỗi khi cài đặt request.", error.message);
    }
    
    return Promise.reject(error);
  });

  export default instance;