/**
 * useLotesProducao - Hook para gerenciar lotes de produção
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { orderBy } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { LoteProducao } from '@/types';

/**
 * Hook especializado para operações com lotes de produção
 */
export function useLotesProducao() {
  const constraints = useMemo(() => [orderBy('dataProducao', 'desc')], []);
  
  return useFirestore<LoteProducao>({
    collectionName: 'lotesProducao',
    queryConstraints: constraints,
  });
}
