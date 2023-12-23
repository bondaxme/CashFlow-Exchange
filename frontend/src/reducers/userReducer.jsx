import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

const initialState = {
  firstName: null,
  lastName: null,
  email: null,
  uid: null,
};

const userReducer = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      return produce(state, (draftState) => {
        draftState.firstName = action.payload.firstName;
        draftState.lastName = action.payload.lastName;
        draftState.email = action.payload.email;
        draftState.uid = action.payload.uid;
      });
    },
    removeUser(state) {
      return produce(state, (draftState) => {
        draftState.firstName = null;
        draftState.lastName = null;
        draftState.email = null;
        draftState.uid = null;
      });
    },
  },
});

export const { setUser, removeUser } =
  userReducer.actions;

export default userReducer.reducer;