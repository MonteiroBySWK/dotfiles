/**
 * AuthContext - Contexto de Autenticação
 * Sistema REVIS
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Usuario, NivelUsuario } from '@/types';

interface AuthContextType {
  user: User | null;
  userData: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createUser: (email: string, password: string, nome: string, nivel: NivelUsuario) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Buscar dados adicionais do usuário no Firestore
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as Usuario);
          } else {
            console.warn('Usuário autenticado mas sem dados no Firestore');
            setUserData(null);
          }
        } catch (error: any) {
          console.error('Erro ao buscar dados do usuário:', error);
          
          // Se for erro de offline, criar dados mínimos do usuário
          if (error.code === 'unavailable' || error.message?.includes('offline')) {
            console.warn('Firebase offline - criando dados básicos do usuário');
            setUserData({
              id: user.uid,
              nome: user.email?.split('@')[0] || 'Usuário',
              email: user.email || '',
              nivel: NivelUsuario.VISUALIZADOR,
              ativo: true,
              criadoEm: new Date() as any,
              atualizadoEm: new Date() as any,
            });
          } else {
            setUserData(null);
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const createUser = async (
    email: string,
    password: string,
    nome: string,
    nivel: NivelUsuario
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Criar documento do usuário no Firestore
      const newUser: Omit<Usuario, 'id'> = {
        nome,
        email,
        nivel,
        ativo: true,
        criadoEm: new Date() as any,
        atualizadoEm: new Date() as any,
      };

      await setDoc(doc(db, 'usuarios', user.uid), newUser);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signOut,
    createUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
