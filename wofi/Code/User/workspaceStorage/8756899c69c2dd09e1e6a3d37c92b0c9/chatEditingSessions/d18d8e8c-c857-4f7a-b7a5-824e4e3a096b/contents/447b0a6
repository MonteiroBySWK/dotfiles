'use client';

import { useEffect } from 'react';
import { useStoreInitializer } from '@/hooks/useStoreInitializer';
import { UserProvider } from '@/stores/userStore'
import { MemberProvider } from '@/stores/memberStore'
import { TeamProvider } from '@/stores/teamStore'

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Inicializar stores
  useStoreInitializer();

  return (
    <UserProvider>
      <MemberProvider>
        <TeamProvider>{children}</TeamProvider>
      </MemberProvider>
    </UserProvider>
  );
}
