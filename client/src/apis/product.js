import axios from "./axios";

/**
 * Hàm khai báo axios gọi tới đường dẫn '/product/'
 * Không xử lí kết quả, chỉ gọi hàm.
 * @param { * } params
 * Author: PMChien(11/08/2024)
 */
export const getProduct = (params) => {
    return axios({
        url: '/products/',
        method: 'get',
        params
    });
}

// const product = {
//     getAllProduct
// }

// export default product;