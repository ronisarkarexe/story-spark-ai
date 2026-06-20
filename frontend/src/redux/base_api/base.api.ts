import { API_BASE } from "../../helpers/config";
import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tag-types";
import axiosBaseQuery from "../../helpers/axios/axios.base.query";

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: API_BASE }),
  endpoints: () => ({}),
  tagTypes: tagTypesList, 
});

export default baseApi;
