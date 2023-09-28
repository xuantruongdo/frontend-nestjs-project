import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isAuthenticated: false,
    user: {
      email: "",
      fullname: "",
      age: "",
      gender: "",
      address: "",
      role: {
        _id: "",
        name: ""
      },
      _id: "",
    },
};
  
export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
      doLoginAction: (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      },
      doGetAccountAction: (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      },
      doUpdateUser: (state, action) => {
        state.user = action.payload;
      },
      doLogoutAction: (state, action) => {
        state.isAuthenticated = false;
        state.user = {
          email: "",
          fullname: "",
          age: "",
          gender: "",
          address: "",
          role: {
            _id: "",
            name: ""
          },
          _id: "",
        };
      },
    },
  
    extraReducers: (builder) => {},
});
  
export const { doLoginAction, doGetAccountAction, doLogoutAction, doUpdateUser } = accountSlice.actions;

export default accountSlice.reducer;