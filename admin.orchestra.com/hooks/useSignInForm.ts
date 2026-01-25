'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials, setAuthError, selectAuthError } from '../store/slices/authSlice';

export const useSignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const [login, { isLoading, error: rtkError }] = useLoginMutation();

  useEffect(() => {
    if (rtkError) {
      if ('data' in rtkError) {
        const errorData = rtkError.data as any;
        dispatch(setAuthError(errorData.message || 'Login failed'));
      } else {
        dispatch(setAuthError('An unexpected error occurred'));
      }
    }
  }, [rtkError, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field-specific error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    
    // Clear global auth error when user starts typing again
    if (authError) {
      dispatch(setAuthError(null));
    }
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await login(formData).unwrap();
      
      // Set role cookie for middleware to use
      const role = result.roles?.[0] || 'ADMIN';
      document.cookie = `user_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      
      dispatch(setCredentials({ user: result.user }));
      router.push('/dashboard');
    } catch (err) {
      // Error handled by useEffect
      console.error('Failed to log in:', err);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    authError,
    handleChange,
    handleSubmit,
  };
};
