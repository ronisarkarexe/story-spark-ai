import baseApi from "../base_api/base.api";

export const writerApplicationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitWriterApplication: build.mutation({
      query: (data) => ({
        url: "/writer-applications",
        method: "POST",
        data,
      }),
      invalidatesTags: ["User"],
    }),
    getAllWriterApplications: build.query({
      query: () => ({
        url: "/writer-applications",
        method: "GET",
      }),
      providesTags: ["WriterApplication"],
    }),
    updateWriterApplicationStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/writer-applications/${id}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["WriterApplication", "User"],
    }),
  }),
});

export const {
  useSubmitWriterApplicationMutation,
  useGetAllWriterApplicationsQuery,
  useUpdateWriterApplicationStatusMutation,
} = writerApplicationApi;
