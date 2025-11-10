import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService } from '@/services';
import { User } from '@/types';

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
  firebaseUser: AuthUser | null;
  user: User | null; // Dados completos do usuário do nosso database
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Ações
  setFirebaseUser: (user: AuthUser | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  initializeAuth: () => () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        firebaseUser: null,
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,

        // Setters
        setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
        
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
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
              set({ error: null });
              
              if (firebaseUser) {
                // Dados do Firebase Auth
                const authUser: AuthUser = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  emailVerified: firebaseUser.emailVerified,
                };
                
                get().setFirebaseUser(authUser);
                
                // Buscar dados completos do usuário no nosso database
                const userData = await userService.getUserByEmail(firebaseUser.email!)
                
                if (userData) {
                  get().setUser(userData);
                  // Atualizar último login
                  await userService.updateLastLogin(userData.id);
                } else {
                  console.warn('User exists in Firebase but not in database');
                  get().setUser(null);
                }
              } else {
                get().setFirebaseUser(null);
                get().setUser(null);
              }
            } catch (error) {
              console.error('Error in auth state change:', error);
              const message = error instanceof Error ? error.message : 'Authentication error';
              set({ error: message, loading: false });
            }
          });
          
          return unsubscribe;
        },

        // Login com email e senha
        signIn: async (email: string, password: string) => {
          try {
            set({ loading: true, error: null });
            
            // Login no Firebase
            const result = await signInWithEmailAndPassword(auth, email, password);
            
            // Buscar dados do usuário no nosso database
            const userData = await userService.getUserByEmail(email);
            
            if (!userData) {
              throw new Error('User not found in database');
            }

            // Verificar se usuário está ativo
            if (userData.status !== 'active') {
              await signOut(auth);
              throw new Error('Account is not active. Please contact support.');
            }

            // Os dados serão atualizados pelo onAuthStateChanged
            
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
            set({ 
              error: errorMessage,
              loading: false 
            });
            throw error;
          }
        },

        // Cadastro com email e senha
        signUp: async (email: string, password: string, userData: Partial<User>) => {
          try {
            set({ loading: true, error: null });
            
            // Verificar se email já existe no nosso database
            const existingUser = await userService.getUserByEmail(email);
            if (existingUser) {
              throw new Error('Email already registered');
            }

            // Criar usuário no Firebase
            const result = await createUserWithEmailAndPassword(auth, email, password);
            
            // Atualizar perfil do Firebase
            if (userData.name) {
              await updateProfile(result.user, {
                displayName: userData.name
              });
            }

            // Criar usuário no nosso database
            const newUserData: Omit<User, 'id'> = {
              name: userData.name || '',
              email: email,
              avatar: userData.avatar,
              role: userData.role || 'viewer',
              department: userData.department,
              position: userData.position,
              phone: userData.phone,
              bio: userData.bio,
              skills: userData.skills || [],
              status: 'pending', // Novos usuários começam como pendentes
              preferences: {
                theme: 'system',
                language: 'pt-BR',
                timezone: 'America/Sao_Paulo',
                notifications: {
                  email: true,
                  push: true,
                  inApp: true
                },
                dashboard: {
                  layout: 'default',
                  widgets: []
                }
              },
              permissions: [],
              companyId: userData.companyId,
              teamIds: userData.teamIds || [],
              createdAt: new Date(),
              updatedAt: new Date()
            };

            await userService.createUser(newUserData);
            
            // Os dados serão atualizados pelo onAuthStateChanged
            
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
            set({ 
              error: errorMessage,
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
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login com Google';
            set({ 
              error: errorMessage,
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
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer logout';
            set({ 
              error: errorMessage,
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
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email de recuperação';
            set({ error: errorMessage });
            throw error;
          }
        },

        // Atualizar perfil do usuário
        updateUserProfile: async (data: Partial<User>) => {
          try {
            set({ error: null });
            const currentUser = get().user;
            const firebaseUser = get().firebaseUser;
            
            if (!currentUser) {
              throw new Error('No user logged in');
            }

            // Atualizar no nosso database
            await userService.updateUser(currentUser.id, data);
            
            // Atualizar no Firebase se nome ou avatar mudaram
            if (auth.currentUser && (data.name || data.avatar)) {
              await updateProfile(auth.currentUser, {
                displayName: data.name || auth.currentUser.displayName,
                photoURL: data.avatar || auth.currentUser.photoURL
              });
            }

            // Buscar dados atualizados
            const updatedUser = await userService.getUserById(currentUser.id);
            set({ user: updatedUser });
            
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
            set({ error: errorMessage });
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
    ),
    { name: 'auth-store' }
  )
);
