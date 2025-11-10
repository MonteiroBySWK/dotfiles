/**
 * Hook para gerenciar Pontos de Venda no Firestore
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { useFirestore } from './useFirestore';
import { PontoVenda } from '@/types';
import { where, orderBy } from 'firebase/firestore';

export function usePontosVenda(apenasAtivos = true) {
  const constraints = useMemo(() => {
    const base = [orderBy('nome', 'asc')];
    if (apenasAtivos) {
      return [where('ativo', '==', true), ...base];
    }
    return base;
  }, [apenasAtivos]);

  const firestore = useFirestore<PontoVenda>({ 
    collectionName: 'pontosVenda',
    queryConstraints: constraints,
  });

  return {
    ...firestore,
    pontosVenda: firestore.data,
  };
}
