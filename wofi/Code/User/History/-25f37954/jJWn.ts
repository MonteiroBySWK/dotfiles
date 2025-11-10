/**
 * useIngredientes - Hook para gestão de ingredientes
 * Sistema REVIS
 */

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
  return useFirestore<Ingrediente>({
    collectionName: 'ingredientes',
    queryConstraints: [orderBy('nome', 'asc')],
  });
}
