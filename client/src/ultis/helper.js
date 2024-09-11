
import icons from './icon';

const { AiOutlineStar, AiFillStar } = icons

/**
 * Tạo slug từ chuỗi có sẵn
 * @param {string} string Chuỗi cần tạo slug
 * @returns {string} slug / ''
 * Author: PMChien (05/08/2024)
 */
export const createSlug = (string) => {
    try {
        if(typeof string !== 'string') {
            return '';
        }
        else {
            let slug = string.toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .split(' ')
                            .join('-');
            return slug;
        }
    }
    catch (e) {
        console.error(`Đã xảy ra lỗi ${e}`);
    }
}

/**
 * Hàm tạo mảng các star theo số nhận vào
 * @param {number} number Số điểm trung bình trên thang 5 để hiển thị dưới dạng star
 * @param {number} size kích thước (pixel) của icon star mặc định 16px
 * @param {string} color tên class định nghĩa màu cho icon mặc định 'text-main'
 * @return {Array} stars - Mảng các icon star
 * Author: PNChien (28/08/2024)
 */
export const renderStarFromNumber = (number, size = 16, color = 'text-main') => {
    try {
        if(typeof number !== 'number') {
            return;
        }
        const stars = []
        for(let i = 0; i < +number; i++) {
            stars.push(<AiFillStar key={i} className={color} size={size}/>);
        }
        for(let i = 5; i > +number; i--) {
            stars.push(<AiOutlineStar key={i} className={color} size={size}/>);
        }
        return stars;
    } catch (error) {
        console.error(`Đã xảy ra lỗi ${error}`);
    } 
}

/**
 * format tiền tệ
 * @param {string} price 
 * @returns format currency
 * @author PMChien (10/09/2024)
 */
export const formatCurrency = (price) => {
    try {
        let num = Number(price);
        if(!isNaN(num)) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
        }
        else {
            return '';
        }
    } catch (error) {
        console.error(`Đã xảy ra lỗi ${error}`);
    }
}