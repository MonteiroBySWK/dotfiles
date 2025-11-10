/**
 * usePedidos - Hook para gerenciar pedidos
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { Pedido } from '@/types';

/**
 * Hook especializado para operações com pedidos
 */
export function usePedidos() {
  const constraints = useMemo(() => [orderBy('criadoEm', 'desc')], []);
  
  return useFirestore<Pedido>({
    collectionName: 'pedidos',
    queryConstraints: constraints,
  });
}
