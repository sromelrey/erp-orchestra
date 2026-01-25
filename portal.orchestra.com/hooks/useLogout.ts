'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '../store/api/authApi';
import { logout as logoutAction } from '../store/slices/authSlice';

export function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    try {
      // 1. Call backend to destroy session and clear connect.sid
      await logoutMutation().unwrap();
      
      // 2. Clear client-side cookies
      document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
      
      // 3. Clear Redux state
      dispatch(logoutAction());
      
      // 4. Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: clear state and redirect anyway if API fails
      document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
      dispatch(logoutAction());
      router.push('/login');
    }
  };

  return { logout };
}
