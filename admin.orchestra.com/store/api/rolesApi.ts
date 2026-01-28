import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  tagTypes: ["Roles"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getRoles: builder.query<any, void>({
      query: () => "/roles",
      providesTags: ["Roles"],
    }),
  }),
});

export const { useGetRolesQuery } = rolesApi;
