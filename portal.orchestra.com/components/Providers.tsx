'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthInit } from './AuthInit';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInit>
        {children}
      </AuthInit>
    </Provider>
  );
}
