import baseApi from "./base_api/base.api";
import storyReducer from "./slices/storySlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,

  story: storyReducer,
};