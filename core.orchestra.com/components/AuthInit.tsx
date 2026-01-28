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
        dispatch(initialize({ user: data.user || data }));
      } else if (isError) {
        dispatch(initialize({ user: null }));
      }
    }
  }, [data, isSuccess, isError, isLoading, dispatch]);

  return <>{children}</>;
}
