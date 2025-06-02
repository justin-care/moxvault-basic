import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../slices/historySlice";
import uiReducer from "../slices/uiSlice";

const store = configureStore({
    reducer: {
        ui: uiReducer,
        game: gameReducer
    },
});

export default store;