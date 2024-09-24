import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProduct } from "../../apis/product";

/**
 * Thunk action để lấy danh sách sản phẩm mới newArrivals từ api
 * Hàm gọi API `getProduct` để lấy 10 sản phẩm mới nhất
 * 
 * @async
 * @param {object} data - Dữ liệu đầu vào
 * @param {object} thunkAPI - Đối tượng cung cấp các công cụ của Redux Toolkit để xử lý action.
 * @returns {Promise<object>} Trả về một promise đưa ra dữ liệu sản phẩm thành công hoặc lỗi nếu thất bại
 * @author PMChien (24/09/2024)
 */
export const getNewArrivals = createAsyncThunk(
    'product/getNewArrivals', 
    async (data, { rejectWithValue }) => {
        const response = await getProduct({ sort: -createdAt , limit: 10});
        console.log(response);
        if(!response.success) {
            console.log("reject: ", response.success);
            return rejectWithValue(response);
        }
        return response;
});

/**
 * Thunk action để lấy danh sách sản phẩm bán chạy nhất bestSeller từ api
 * Hàm gọi API `getProduct` để lấy 10 sản phẩm mới Bán chạy nhất
 * 
 * @async
 * @param {object} data - Dữ liệu đầu vào
 * @param {object} thunkAPI - Đối tượng cung cấp các công cụ của Redux Toolkit để xử lý action.
 * @returns {Promise<object>} Trả về một promise đưa ra dữ liệu sản phẩm thành công hoặc lỗi nếu thất bại
 * @author PMChien (24/09/2024)
 */
export const getBestSellers = createAsyncThunk(
    'product/getBestSellers', 
    async (data, { rejectWithValue }) => {
        const response = await getProduct({ sort: -sold , limit: 10});
        console.log(response);
        if(!response.success) {
            console.log("reject: ", response.success);
            return rejectWithValue(response);
        }
        return response;
});

