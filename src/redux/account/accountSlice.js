import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isAuthenticated: false,
    user: {
      email: "",
      fullname: "",
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
      doLogoutAction: (state, action) => {
        state.isAuthenticated = false;
        state.user = {
          email: "",
          fullname: "",
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
  
export const { doLoginAction, doGetAccountAction, doLogoutAction } = accountSlice.actions;

export default accountSlice.reducer;