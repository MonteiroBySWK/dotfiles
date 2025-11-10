/**
 * Hook para gerenciar Vendas no Firestore
 * Sistema REVIS
 */

import { useFirestore } from './useFirestore';
import { Venda } from '@/types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

interface UseVendasOptions {
  eventoId?: string;
  pontoVendaId?: string;
  produtoId?: string;
}

export function useVendas(options: UseVendasOptions = {}) {
  const constraints: QueryConstraint[] = [];

  // Adicionar filtros opcionais
  if (options.eventoId) {
    constraints.push(where('eventoId', '==', options.eventoId));
  }
  if (options.pontoVendaId) {
    constraints.push(where('pontoVendaId', '==', options.pontoVendaId));
  }
  if (options.produtoId) {
    constraints.push(where('produtoId', '==', options.produtoId));
  }

  // OrderBy por último
  constraints.push(orderBy('dataVenda', 'desc'));

  const firestore = useFirestore<Venda>({ 
    collectionName: 'vendas',
    queryConstraints: constraints,
  });

  return {
    ...firestore,
    vendas: firestore.data,
  };
}
