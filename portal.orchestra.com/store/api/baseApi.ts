import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Shared base API for all features.
 * Consolidating to a single API slice allows for cross-feature tag invalidation
 * (e.g. rolesApi invalidating usersApi tags).
 */
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      // Logic for shared headers (e.g. auth tokens) can be added here
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['User', 'Role', 'Permission', 'Session', 'Departments', 'Designations', 'Branches'],
  endpoints: () => ({}), // Endpoints will be injected by feature-specific files
});
