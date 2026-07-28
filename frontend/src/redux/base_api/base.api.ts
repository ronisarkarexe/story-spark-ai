import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tag-types";
import axiosBaseQuery from "../../helpers/axios/axios.base.query";
import { getBaseUrl } from "../../helpers/config";

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: getBaseUrl() }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});

export default baseApi;
