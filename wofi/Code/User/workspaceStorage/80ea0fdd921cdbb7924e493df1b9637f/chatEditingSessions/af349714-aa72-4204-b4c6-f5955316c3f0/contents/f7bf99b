/**
 * useFirestore - Hook genérico para operações CRUD no Firestore
 * Sistema REVIS
 * 
 * ⚠️ IMPORTANTE: Para evitar fetch infinito, passe queryConstraints memorizadas:
 * const constraints = useMemo(() => [orderBy('nome')], []);
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  QueryConstraint,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface UseFirestoreOptions {
  collectionName: string;
  queryConstraints?: QueryConstraint[];
  realtime?: boolean;
}

interface UseFirestoreResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  create: (data: Omit<T, 'id'>) => Promise<string>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Promise<T | null>;
  refresh: () => Promise<void>;
}

/**
 * Hook genérico para operações CRUD no Firestore
 * 
 * @example
 * const constraints = useMemo(() => [orderBy('nome', 'asc')], []);
 * const { data, loading, create, update } = useFirestore<Ingrediente>({
 *   collectionName: 'ingredientes',
 *   queryConstraints: constraints
 * });
 */
export function useFirestore<T extends { id: string }>(
  options: UseFirestoreOptions
): UseFirestoreResult<T> {
  const { collectionName, queryConstraints = [], realtime = false } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Usar ref para evitar re-renders desnecessários
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);

      const collectionRef = collection(db, collectionName);
      const q = queryConstraints.length > 0 
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;

      const snapshot = await getDocs(q);
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as T));

      if (isMountedRef.current) {
        setData(documents);
      }
    } catch (err: any) {
      console.error(`Erro ao buscar ${collectionName}:`, err);
      
      if (isMountedRef.current) {
        if (err.code === 'unavailable' || err.message?.includes('offline')) {
          console.warn(`Firebase offline - usando cache para ${collectionName}`);
          setError(new Error('Modo offline - dados podem estar desatualizados'));
        } else {
          setError(err as Error);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [collectionName, JSON.stringify(queryConstraints)]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (realtime) {
      // Modo realtime com onSnapshot
      const collectionRef = collection(db, collectionName);
      const q = queryConstraints.length > 0 
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;

      unsubscribeRef.current = onSnapshot(
        q,
        (snapshot) => {
          if (isMountedRef.current) {
            const documents = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            } as T));
            setData(documents);
            setLoading(false);
          }
        },
        (err) => {
          console.error(`Erro no listener de ${collectionName}:`, err);
          if (isMountedRef.current) {
            setError(err as Error);
            setLoading(false);
          }
        }
      );
    } else {
      // Modo fetch normal
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [collectionName, realtime, fetchData]);

  const create = async (newData: Omit<T, 'id'>): Promise<string> => {
    try {
      const collectionRef = collection(db, collectionName);
      const dataWithTimestamps = {
        ...newData,
        criadoEm: Timestamp.now(),
        atualizadoEm: Timestamp.now(),
      };

      const docRef = await addDoc(collectionRef, dataWithTimestamps);
      await fetchData();
      return docRef.id;
    } catch (err) {
      console.error(`Erro ao criar ${collectionName}:`, err);
      throw err;
    }
  };

  const update = async (id: string, updateData: Partial<T>): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      const dataWithTimestamp = {
        ...updateData,
        atualizadoEm: Timestamp.now(),
      };

      await updateDoc(docRef, dataWithTimestamp);
      await fetchData();
    } catch (err) {
      console.error(`Erro ao atualizar ${collectionName}:`, err);
      throw err;
    }
  };

  const remove = async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      await fetchData();
    } catch (err) {
      console.error(`Erro ao deletar ${collectionName}:`, err);
      throw err;
    }
  };

  const getById = async (id: string): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as T;
      }

      return null;
    } catch (err) {
      console.error(`Erro ao buscar ${collectionName} por ID:`, err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    getById,
    refresh: fetchData,
  };
}
