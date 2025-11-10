/**
 * Hook para gerenciar Vendas no Firestore
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { useFirestore } from './useFirestore';
import { Venda } from '@/types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

interface UseVendasOptions {
  eventoId?: string;
  pontoVendaId?: string;
  produtoId?: string;
}

export function useVendas(options: UseVendasOptions = {}) {
  const { eventoId, pontoVendaId, produtoId } = options;
  
  const constraints = useMemo(() => {
    const result: QueryConstraint[] = [];

    // Adicionar filtros opcionais
    if (eventoId) {
      result.push(where('eventoId', '==', eventoId));
    }
    if (pontoVendaId) {
      result.push(where('pontoVendaId', '==', pontoVendaId));
    }
    if (produtoId) {
      result.push(where('produtoId', '==', produtoId));
    }

    // OrderBy por último
    result.push(orderBy('dataVenda', 'desc'));
    
    return result;
  }, [eventoId, pontoVendaId, produtoId]);

  const firestore = useFirestore<Venda>({ 
    collectionName: 'vendas',
    queryConstraints: constraints,
  });

  return {
    ...firestore,
    vendas: firestore.data,
  };
}
