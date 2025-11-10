/**
 * usePedidos - Hook para gerenciar pedidos
 * Sistema REVIS
 */

import { orderBy } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { Pedido } from '@/types';

/**
 * Hook especializado para operações com pedidos
 */
export function usePedidos() {
  return useFirestore<Pedido>({
    collectionName: 'pedidos',
    queryConstraints: [orderBy('criadoEm', 'desc')],
  });
}
