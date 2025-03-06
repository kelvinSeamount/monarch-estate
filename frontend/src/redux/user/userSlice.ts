import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../../types";

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

    sigInSuccess: create.reducer((state, action: PayloadAction<UserState>) => {
      state.currentUser = action.payload.currentUser;
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

    updateUserSuccess: create.reducer(
      (state, action: PayloadAction<UserState>) => {
        state.currentUser = action.payload.currentUser;
        state.loading = false;
        state.error = "";
      }
    ),

    updateUserFailure: create.reducer(
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
} = userSlice.actions;
export default userSlice.reducer;
