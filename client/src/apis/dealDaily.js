import axios from './axios';

const path = '/deal-dailys';

/**
 * Hàm lấy deal daily tại thời điểm hiện tại
 * @returns {Response} trả về dữ liệu từ server
 * @author PMchien (18/09/2024)
 */
export const getCurrentDealDaily = async () => {
    const res = await axios.get(`${path}/current`);
    console.log(res);
    return res;
}