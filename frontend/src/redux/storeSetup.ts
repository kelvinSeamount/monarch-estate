import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./user/userSlice";
//import { persistReducer, persistStore } from "redux-persist";

//import { FLUSH, REHYDRATE, PAUSE, PERSIST,  PURGE,REGISTER,} from "redux-persist";
export const store = configureStore({
  reducer: { user: useReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
