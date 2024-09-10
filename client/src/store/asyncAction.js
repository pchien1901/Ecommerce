import { createAsyncThunk } from "@reduxjs/toolkit";
import productCategories from "../apis/productCategories";

export const getProductCategories = createAsyncThunk(
    'app/productCategories', 
    async (data, { rejectWithValue }) => {
        const response = await productCategories.getAllProductCategories();
        console.log(response);
        if(!response.success) {
            console.log("reject: ", response.success);
            return rejectWithValue(response);
        }
        return response;
});