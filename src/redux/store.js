import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/counter/counterSlice';
import accountSlice from "./account/accountSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    account: accountSlice,
  },
});
