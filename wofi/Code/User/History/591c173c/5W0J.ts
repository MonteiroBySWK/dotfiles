/**
 * Hook para gerenciar Pontos de Venda no Firestore
 * Sistema REVIS
 */

import { useFirestore } from './useFirestore';
import { PontoVenda } from '@/types';
import { where } from 'firebase/firestore';

export function usePontosVenda(apenasAtivos = true) {
  const constraints = apenasAtivos ? [where('ativo', '==', true)] : [];

  const firestore = useFirestore<PontoVenda>({ 
    collectionName: 'pontosVenda',
    queryConstraints: constraints,
  });

  return {
    ...firestore,
    pontosVenda: firestore.data,
  };
}
