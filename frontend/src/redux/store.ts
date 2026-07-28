import { configureStore } from "@reduxjs/toolkit";
import baseApi from "./base_api/base.api";
import { reducer } from "./root.reducer";

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
