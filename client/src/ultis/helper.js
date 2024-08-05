
/**
 * Tạo slug từ chuỗi có sẵn
 * @param {string} string Chuỗi cần tạo slug
 * @returns {string} slug / ''
 * Author: PMChien (05/08/2024)
 */
export const createSlug = (string) => {
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