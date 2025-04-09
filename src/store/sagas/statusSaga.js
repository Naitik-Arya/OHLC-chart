import axios from "axios";
import { fetchStatusFailure, fetchStatusRequest, fetchStatusSuccess } from "../slices/statusSlice";
import { call, put, takeLatest } from "redux-saga/effects";

const API_URL = "/api/v2/platform/status";

function* fetchStatus() {
    try{
        const response = yield call(axios.get, API_URL);
        yield put(fetchStatusSuccess(response.data));
    }
    catch(error) {
        yield put(fetchStatusFailure(error.message));
    }
}

export function* watchStatusSaga() {
    yield takeLatest(fetchStatusRequest.type, fetchStatus);
}