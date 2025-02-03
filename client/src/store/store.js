import { configureStore } from "@reduxjs/toolkit";
import stocksReducer from "../slice/stockSlice";

const store = configureStore({
  reducer: {
    stocks: stocksReducer,
  },
});

export default store;
