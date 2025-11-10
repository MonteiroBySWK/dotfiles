'use client';

import { useEffect } from 'react';
import { useStoreInitializer } from '@/hooks/useStoreInitializer';
import { UserProvider } from '@/stores/userStore'
import { MemberProvider } from '@/stores/memberStore'
import { TeamProvider } from '@/stores/teamStore'
import { NotificationProvider } from '@/contexts/NotificationContext'

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // NOTE: we must run the store initializer only after context providers are mounted.
  // The initializer uses `useMemberStore` (a context hook), so calling it before
  // the MemberProvider is rendered will throw. To ensure it runs inside the
  // provider tree, render an inner component that calls the initializer.

  function InitRunner({ children }: { children: React.ReactNode }) {
    useStoreInitializer();
    return <>{children}</>;
  }

  return (
    <UserProvider>
      <MemberProvider>
        <TeamProvider>
          <NotificationProvider>
            <InitRunner>{children}</InitRunner>
          </NotificationProvider>
        </TeamProvider>
      </MemberProvider>
    </UserProvider>
  );
}
