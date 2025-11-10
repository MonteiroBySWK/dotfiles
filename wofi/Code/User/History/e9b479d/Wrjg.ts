/**
 * useLotesProducao - Hook para gerenciar lotes de produção
 * Sistema REVIS
 */

import { orderBy } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { LoteProducao } from '@/types';

/**
 * Hook especializado para operações com lotes de produção
 */
export function useLotesProducao() {
  return useFirestore<LoteProducao>({
    collectionName: 'lotesProducao',
    queryConstraints: [orderBy('dataProducao', 'desc')],
  });
}
