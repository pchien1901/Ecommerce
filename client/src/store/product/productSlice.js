import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newArrivals : null,
        bestSeller: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(actions.getProductCategories.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getProductCategories.fulfilled, (state, action) => {
            state.isLoading = false;
            let { data } = action.payload;
            console.log('data: ', data);
            state.productCategories = data;
        });
        builder.addCase(actions.getProductCategories.rejected, (state, action) => {
            console.log("actions.getProductCategories.rejected ",action.payload);
        });
    }
});

//export const {  } = productSlice.actions;

export default productSlice.reducer;