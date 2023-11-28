// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// import cartReducer from "../components/reducers/cart";

const store = configureStore({
  reducer: {
    // cart: cartReducer,
    user: userReducer,
  },
});

export default store;
