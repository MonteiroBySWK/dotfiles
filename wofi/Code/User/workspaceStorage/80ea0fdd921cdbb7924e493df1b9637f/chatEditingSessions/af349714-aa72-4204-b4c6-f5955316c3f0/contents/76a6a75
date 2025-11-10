/**
 * useIngredientes - Hook para gestão de ingredientes
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { Ingrediente } from '@/types';

/**
 * Hook customizado para operações CRUD de ingredientes
 * 
 * @example
 * const { data: ingredientes, loading, create, update } = useIngredientes();
 */
export function useIngredientes() {
  const constraints = useMemo(() => [orderBy('nome', 'asc')], []);
  
  return useFirestore<Ingrediente>({
    collectionName: 'ingredientes',
    queryConstraints: constraints,
  });
}
