'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '../store/api/authApi';
import { initialize, selectCurrentUser } from '../store/slices/authSlice';

export function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const existingUser = useSelector(selectCurrentUser);
  const { data, isSuccess, isError, isLoading, error } = useGetMeQuery();

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess && data) {
        dispatch(initialize({ user: data }));
      } else if (isError) {
        const status =
          typeof error === 'object' && error !== null && 'status' in error
            ? (error as { status?: number }).status
            : undefined;

        console.log('[AuthInit] /auth/me failed', { status, error });

        if (status === 401 || status === 403) {
          document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
          dispatch(initialize({ user: null }));
        } else {
          dispatch(initialize({ user: existingUser ?? null }));
        }
      }
    }
  }, [data, isSuccess, isError, isLoading, error, dispatch, existingUser]);

  return <>{children}</>;
}
