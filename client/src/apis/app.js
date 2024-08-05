import axios from './axios';
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

        if(response?.status === 200) {
            //console.log(response);
            return response.data;
        }
    } catch (error) {
        console.error(`Đã có lỗi : ${error}`)
    }
}