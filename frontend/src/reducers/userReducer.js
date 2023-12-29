import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: null,
  lastName: null,
  email: null,
  currencyDiff: {
    USD: null,
    EUR: null,
    PLN: null,
    GBP: null,
  },
  isAdmin: false,
  uid: null,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.currencyDiff = action.payload.currencyDiff;
      state.isAdmin = action.payload.isAdmin;
      state.uid = action.payload.uid;
    },
    removeUser: (state) => {
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.currencyDiff = {
        USD: null,
        EUR: null,
        PLN: null,
        GBP: null,
      };
      state.isAdmin = false;
      state.uid = null;
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
