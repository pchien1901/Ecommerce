import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
  });

  // Thêm một bộ đón chặn request
axios.interceptors.request.use(function (config) {
    // Làm gì đó trước khi request dược gửi đi
    return config;
  }, function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  });

// Thêm một bộ đón chặn response
axios.interceptors.response.use(function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response.data;
  }, function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    console.error(`Đã có lỗi xảy ra : ${error}`);
    return error;
  });

  export default instance;