import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    loading: false,
    error: null
};

const statusSlice = createSlice({
    name:"status",
    initialState,
    reducers: {
        fetchStatusRequest: (state)=> {
            state.loading = true;
            state.error = null
        }, 
        fetchStatusSuccess: (state, action) => {
            state.loading = false,
            state.data = action.payload
        },
        fetchStatusFailure: (state, action)=> {
            state.loading = false,
            state.error = action.error
        }
    }
});

export const {fetchStatusFailure, fetchStatusRequest, fetchStatusSuccess} = statusSlice.actions;
export default statusSlice.reducer; 