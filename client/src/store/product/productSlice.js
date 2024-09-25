import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newArrivals: null,
        bestSeller: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(actions.getNewArrivals.pending, (state) => {
            //state.isLoading = true;
        });
        builder.addCase(actions.getNewArrivals.fulfilled, (state, action) => {
            let { data } = action.payload;
            console.log('data: ', data);
            state.newArrivals = data;
        });
        builder.addCase(actions.getNewArrivals.rejected, (state, action) => {
            console.log("actions.getNewArrivals.rejected ",action.payload);
        });
    }
});

//export const {  } = productSlice.actions;

export default productSlice.reducer;