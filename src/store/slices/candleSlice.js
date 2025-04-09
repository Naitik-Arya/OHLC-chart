import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    loading: false,
    error: null
};

const candleSlice = createSlice({
    name: "candle",
    initialState,
    reducers:{
        fetchCandleRequest : (state) =>{
            state.loading = true;
            state.error = null;
        },
        fetchCandleSuccess: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        fetchCandleError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }

    }
});

export const {fetchCandleError, fetchCandleRequest, fetchCandleSuccess} = candleSlice.actions;
export default candleSlice.reducer;