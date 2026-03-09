'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../store/api/authApi';
import { initialize } from '../store/slices/authSlice';

export function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data, isSuccess, isError, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess && data) {
        dispatch(initialize({ user: data }));
      } else if (isError) {
        // Clear the stale authentication cookie if the session check fails
        document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
        dispatch(initialize({ user: null }));
      }
    }
  }, [data, isSuccess, isError, isLoading, dispatch]);

  return <>{children}</>;
}
