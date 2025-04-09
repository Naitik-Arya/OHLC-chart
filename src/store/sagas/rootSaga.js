import { all } from "redux-saga/effects";
import { watchCandleSaga } from "./candleSaga";
import { watchStatusSaga } from "./statusSaga";

export function* rootSaga(){
    yield all([
        watchCandleSaga(),
        watchStatusSaga(),
    ]);
}