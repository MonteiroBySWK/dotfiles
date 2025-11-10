import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useMemberStore } from '@/stores/memberStore';

export function useStoreInitializer() {
  const { initializeAuth } = useAuthStore();
  const { appearance } = useAppStore();
  const { members } = useMemberStore();

  useEffect(() => {
    // Inicializar autenticação
    const unsubscribe = initializeAuth();
    
    // Aplicar tema
    const root = document.documentElement;
    if (appearance.theme === 'dark') {
      root.classList.add('dark');
    } else if (appearance.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Sistema
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    return () => {
      unsubscribe?.();
    };
  }, [initializeAuth, appearance.theme]);

  useEffect(() => {
    // Listener para mudanças de tema do sistema
    if (appearance.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleThemeChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleThemeChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleThemeChange);
      };
    }
  }, [appearance.theme]);

  useEffect(() => {
    // Inicializar dados de membros se necessário
    if (members.length === 0) {
      // Aqui poderiam ser carregados dados do Firebase/API
      console.log('Membros inicializados do localStorage/store');
    }
  }, [members.length]);
}
