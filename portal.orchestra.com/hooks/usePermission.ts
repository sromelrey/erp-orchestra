
import { useSelector } from 'react-redux';
import { selectHasPermission } from '../store/slices/authSlice';

/**
 * Custom hook to check if the current user has a specific permission.
 * 
 * @param slug - The permission slug to check (e.g., 'users.create')
 * @returns boolean - True if user has the permission
 */
export const usePermission = (slug: string): boolean => {
  return useSelector(selectHasPermission(slug));
};
