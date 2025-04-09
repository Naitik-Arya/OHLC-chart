import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { fetchCandleError, fetchCandleRequest, fetchCandleSuccess } from "../slices/candleSlice";

const API_URL ="/api/v2/candles/trade%3A1m%3AtBTCUSD/hist";

function* fetchCandle() {
    try{
        const response = yield call(axios.get, API_URL);
        console.log("API Response:", response.data); 
        yield put(fetchCandleSuccess(response.data));
    }
    catch(error) {
        console.error("API Error:", error);  
        yield put(fetchCandleError(response.data));
    }
}

export function* watchCandleSaga() {
    yield takeLatest(fetchCandleRequest.type, fetchCandle);
}