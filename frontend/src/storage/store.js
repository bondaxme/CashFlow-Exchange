import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export default store;
