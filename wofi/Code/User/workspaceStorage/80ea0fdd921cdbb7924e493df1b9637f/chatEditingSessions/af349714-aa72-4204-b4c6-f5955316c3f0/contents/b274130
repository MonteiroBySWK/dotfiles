/**
 * useEventos - Hook para gerenciar eventos
 * Sistema REVIS
 */

import { orderBy } from 'firebase/firestore';
import { useFirestore } from './useFirestore';
import { Evento } from '@/types';

/**
 * Hook especializado para operações com eventos
 */
export function useEventos() {
  return useFirestore<Evento>({
    collectionName: 'eventos',
    queryConstraints: [orderBy('dataEvento', 'desc')],
  });
}
