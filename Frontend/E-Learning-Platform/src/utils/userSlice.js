// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // Initial state is null because no user is logged in initially.
  },
  reducers: {
    loginUser: (state, action) => {
      console.log(action.payload);
      state.user = action.payload; // Set the user data upon successful login.
    },
    logoutUser: (state) => {
      state.user = null; // Clear the user data upon logout.
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
