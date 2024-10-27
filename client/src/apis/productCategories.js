import axios from './axios.js';
import { route } from './api.routes.js';

/**
 * Hàm lấy tất cả product category
 * @returns {object} {
 *  success: true - thành công,
 *  code: 200
 *  devMsg: Thông báo cho dev,
 *  userMsg: Thông báo user,
 *  data: array of product category,
 *  counts: số bản ghi trả về
 * }
 * Author: PMChien (04/08/2024)
 */
export const getAllProductCategories = async () => {
    try {
        let response = await axios({ 
            url: route.productCategory.getAllCategories,
            method: 'get'
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error(`Đã có lỗi : ${error}`);
        return error;
    }
}

/**
 * Lấy các product category theo param
 * @param {*} params params để lọc các product category
 * @returns 
 * {
 *  success: true - thành công,
 *  code: 200
 *  devMsg: Thông báo cho dev,
 *  userMsg: Thông báo user,
 *  data: array of product category,
 *  counts: số bản ghi trả về
 * }
 * Author: PMChien (26/10/2024)
 */
export const getProductCategories = async ( params ) => {
  try {
    let response = await axios({
      url: '/product-categories/',
      method: 'get',
      params
    });
    return response;
  } catch (error) {
    console.error(`Đã xảy ra lỗi khi gọi getProductCategories với params: ${error}`);
  }
}

// const productCategories = {
//     getAllProductCategories
// }

// export default productCategories;