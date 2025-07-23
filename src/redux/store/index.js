import { configureStore } from "@reduxjs/toolkit";
import targetMaturityReducer from "./targetMaturitySlice";

export const store = configureStore({
    reducer: {
        targetMaturity: targetMaturityReducer,
    },
});
