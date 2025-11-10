/**
 * Hook para gerenciar Vendas no Firestore
 * Sistema REVIS
 */

import { useFirestore } from './useFirestore';
import { Venda } from '@/types';
import { orderBy, where, WhereFilterOp } from 'firebase/firestore';

interface UseVendasOptions {
  eventoId?: string;
  pontoVendaId?: string;
  produtoId?: string;
}

export function useVendas(options: UseVendasOptions = {}) {
  const constraints = [orderBy('dataVenda', 'desc')];

  // Adicionar filtros opcionais
  if (options.eventoId) {
    constraints.unshift(where('eventoId', '==', options.eventoId));
  }
  if (options.pontoVendaId) {
    constraints.unshift(where('pontoVendaId', '==', options.pontoVendaId));
  }
  if (options.produtoId) {
    constraints.unshift(where('produtoId', '==', options.produtoId));
  }

  const firestore = useFirestore<Venda>({ 
    collectionName: 'vendas',
    queryConstraints: constraints,
  });

  return {
    ...firestore,
    vendas: firestore.data,
  };
}
