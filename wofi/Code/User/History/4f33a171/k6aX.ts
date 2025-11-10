/**
 * useProdutos - Hook para gerenciar produtos
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { Produto } from '@/types';

/**
 * Hook especializado para operações com produtos
 */
export function useProdutos() {
  const constraints = useMemo(() => [orderBy('nome', 'asc')], []);
  
  return useFirestore<Produto>({
    collectionName: 'produtos',
    queryConstraints: constraints,
  });
}
