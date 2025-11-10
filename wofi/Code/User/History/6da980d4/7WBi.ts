/**
 * Hook para gerenciar Vendas no Firestore
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { useFirestore } from './useFirestore';
import { Venda } from '@/types';
import { orderBy } from 'firebase/firestore';

interface UseVendasOptions {
  eventoId?: string;
  pontoVendaId?: string;
  produtoId?: string;
}

export function useVendas(options: UseVendasOptions = {}) {
  const { eventoId, pontoVendaId, produtoId } = options;
  
  // Buscar todas as vendas ordenadas (sem where para evitar índice composto)
  const constraints = useMemo(() => {
    return [orderBy('dataVenda', 'desc')];
  }, []);

  const firestore = useFirestore<Venda>({ 
    collectionName: 'vendas',
    queryConstraints: constraints,
  });

  // Filtrar no client-side
  const vendasFiltradas = useMemo(() => {
    let filtered = firestore.data;
    
    if (eventoId) {
      filtered = filtered.filter(v => v.eventoId === eventoId);
    }
    if (pontoVendaId) {
      filtered = filtered.filter(v => v.pontoVendaId === pontoVendaId);
    }
    if (produtoId) {
      filtered = filtered.filter(v => v.produtoId === produtoId);
    }
    
    return filtered;
  }, [firestore.data, eventoId, pontoVendaId, produtoId]);

  return {
    ...firestore,
    vendas: vendasFiltradas,
    data: vendasFiltradas,
  };
}
