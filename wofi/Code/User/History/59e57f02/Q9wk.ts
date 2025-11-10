import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

// Tipos
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthState {
  // Estado
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Ações
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  initializeAuth: () => () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false,

      // Setters
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        loading: false 
      }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Inicializar listener de autenticação
      initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const user: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
            };
            get().setUser(user);
          } else {
            get().setUser(null);
          }
        });
        
        return unsubscribe;
      },

      // Login com email e senha
      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          await signInWithEmailAndPassword(auth, email, password);
          // O user será setado automaticamente pelo onAuthStateChanged
        } catch (error: any) {
          set({ 
            error: error.message || 'Erro ao fazer login',
            loading: false 
          });
          throw error;
        }
      },

      // Cadastro com email e senha
      signUp: async (email: string, password: string, name: string) => {
        try {
          set({ loading: true, error: null });
          const result = await createUserWithEmailAndPassword(auth, email, password);
          // Atualizar perfil com o nome
          await updateProfile(result.user, { displayName: name });
          // O user será setado automaticamente pelo onAuthStateChanged
        } catch (error: any) {
          set({ 
            error: error.message || 'Erro ao criar conta',
            loading: false 
          });
          throw error;
        }
      },

      // Login com Google
      signInWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          // O user será setado automaticamente pelo onAuthStateChanged
        } catch (error: any) {
          set({ 
            error: error.message || 'Erro ao fazer login com Google',
            loading: false 
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          set({ loading: true, error: null });
          await signOut(auth);
          // O user será limpo automaticamente pelo onAuthStateChanged
        } catch (error: any) {
          set({ 
            error: error.message || 'Erro ao fazer logout',
            loading: false 
          });
          throw error;
        }
      },

      // Reset de senha
      resetPassword: async (email: string) => {
        try {
          set({ error: null });
          await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
          set({ error: error.message || 'Erro ao enviar email de recuperação' });
          throw error;
        }
      },

      // Atualizar perfil do usuário
      updateUserProfile: async (displayName: string, photoURL?: string) => {
        try {
          set({ error: null });
          if (auth.currentUser) {
            await updateProfile(auth.currentUser, { 
              displayName,
              ...(photoURL && { photoURL })
            });
            
            // Atualizar estado local
            const currentUser = get().user;
            if (currentUser) {
              set({ 
                user: { 
                  ...currentUser, 
                  displayName, 
                  ...(photoURL && { photoURL }) 
                } 
              });
            }
          }
        } catch (error: any) {
          set({ error: error.message || 'Erro ao atualizar perfil' });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
