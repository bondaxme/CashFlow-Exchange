import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    firstName: null,
    lastName: null,
    email: null,
    uid: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.uid = action.payload.uid;
    },
    removeUser: (state) => {
        state.firstName = null;
        state.lastName = null;
        state.email = null;
        state.uid = null;
    },
  },
});

export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;