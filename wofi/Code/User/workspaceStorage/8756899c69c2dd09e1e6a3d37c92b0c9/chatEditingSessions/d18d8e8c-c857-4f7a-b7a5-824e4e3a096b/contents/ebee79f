'use client';

import { useEffect } from 'react';
import { useStoreInitializer } from '@/hooks/useStoreInitializer';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Inicializar stores
  useStoreInitializer();

  return <>{children}</>;
}
