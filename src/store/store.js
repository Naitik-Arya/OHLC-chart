import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import statusReducer from "./slices/statusSlice"
import candleReducer from "./slices/candleSlice"
import { rootSaga } from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        status: statusReducer,
        candle: candleReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;