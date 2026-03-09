import { baseApi } from './baseApi';

/**
 * Session data returned by the "My Sessions" endpoint.
 */
export interface MySession {
  id: string;
  expiredAt: string;
  ip?: string;
  userAgent?: string;
  current: boolean;
}

/**
 * Session data returned by the admin "All Sessions with Details" endpoint.
 */
export interface AdminSession {
  id: string;
  expiredAt: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    status: 'ACTIVE' | 'INACTIVE';
    tenantId?: number;
    isSystemAdmin: boolean;
  };
}

export const sessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetches all active sessions for the currently logged-in user.
     */
    getMySessions: builder.query<MySession[], void>({
      query: () => '/sessions/my',
      providesTags: [{ type: 'Session', id: 'MY' }],
    }),

    /**
     * Revokes a specific session belonging to the current user.
     */
    revokeMySession: builder.mutation<{ revoked: boolean }, string>({
      query: (sessionId) => ({
        url: `/sessions/my/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Session', id: 'MY' }],
    }),

    /**
     * Fetches all active sessions with user details (admin only).
     */
    getAllSessions: builder.query<AdminSession[], void>({
      query: () => '/sessions/details',
      providesTags: [{ type: 'Session', id: 'ALL' }],
    }),

    /**
     * Removes all sessions for a specific user (admin only).
     */
    revokeUserSessions: builder.mutation<{ deleted: boolean }, number>({
      query: (userId) => ({
        url: `/sessions/user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Session', id: 'ALL' },
        { type: 'Session', id: 'MY' },
      ],
    }),
  }),
});

export const {
  useGetMySessionsQuery,
  useRevokeMySessionMutation,
  useGetAllSessionsQuery,
  useRevokeUserSessionsMutation,
} = sessionsApi;
