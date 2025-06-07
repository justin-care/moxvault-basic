import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../slices/historySlice";
import uiReducer from "../slices/uiSlice";
import toastMiddleware from "../middleware/toastMiddleware";

const store = configureStore({
    reducer: {
        ui: uiReducer,
        game: gameReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(toastMiddleware)
});

export default store;