import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../../types";

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: (create) => ({
    sigInStart: create.reducer((state) => {
      state.loading = true;
    }),

    sigInSuccess: create.reducer((state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = "";
    }),

    signInFailure: create.reducer((state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    }),

    updateUserStart: create.reducer((state) => {
      state.loading = true;
    }),

    updateUserSuccess: create.reducer((state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = "";
    }),

    updateUserFailure: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      }
    ),
    deleteUserStart: create.reducer((state) => {
      state.loading = true;
    }),

    /* Backend returns string message so no need for the Payload*/
    deleteUserSuccess: create.reducer((state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = "";
    }),
    deleteUserFailure: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      }
    ),
    signUserOutStart: create.reducer((state) => {
      state.loading = true;
    }),
    /* Backend returns string message so no need for the Payload*/
    signUserOutSuccess: create.reducer((state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = "";
    }),
    signUserOutFailure: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      }
    ),
  }),
});

export const {
  sigInStart,
  sigInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signUserOutStart,
  signUserOutSuccess,
  signUserOutFailure,
} = userSlice.actions;
export default userSlice.reducer;
