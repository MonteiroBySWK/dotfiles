/**
 * Hook para gerenciar Pontos de Venda no Firestore
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { useFirestore } from './useFirestore';
import { PontoVenda } from '@/types';
import { where, orderBy } from 'firebase/firestore';

export function usePontosVenda(apenasAtivos = true) {
  // Buscar todos sem filtro composto (evita índice)
  const constraints = useMemo(() => {
    return [orderBy('nome', 'asc')];
  }, []);

  const firestore = useFirestore<PontoVenda>({ 
    collectionName: 'pontosVenda',
    queryConstraints: constraints,
  });

  // Filtrar no client-side
  const pontosVendaFiltrados = useMemo(() => {
    if (!apenasAtivos) return firestore.data;
    return firestore.data.filter(ponto => ponto.ativo === true);
  }, [firestore.data, apenasAtivos]);

  return {
    ...firestore,
    pontosVenda: pontosVendaFiltrados,
    data: pontosVendaFiltrados,
  };
}
