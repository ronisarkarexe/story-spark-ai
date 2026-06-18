import baseApi from "../base_api/base.api";
import { NOTIFICATION_URL } from "../base_api/base.endpoints";
import { NotificationItem } from "../../models/notification";
import { tagTypes } from "../tag-types";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationItem[], void>({
      query: () => ({
        url: `/${NOTIFICATION_URL}`,
        method: "GET",
      }),
      transformResponse: (response: { data: NotificationItem[] }) =>
        response.data,
      providesTags: [tagTypes.notification],
    }),
    markNotificationRead: build.mutation<NotificationItem, string>({
      query: (id) => ({
        url: `/${NOTIFICATION_URL}/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = notificationApi;