/**
 * useProdutos - Hook para gerenciar produtos
 * Sistema REVIS
 */

import { orderBy } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { Produto } from '@/types';

/**
 * Hook especializado para operações com produtos
 */
export function useProdutos() {
  return useFirestore<Produto>({
    collectionName: 'produtos',
    queryConstraints: [orderBy('nome', 'asc')],
  });
}
