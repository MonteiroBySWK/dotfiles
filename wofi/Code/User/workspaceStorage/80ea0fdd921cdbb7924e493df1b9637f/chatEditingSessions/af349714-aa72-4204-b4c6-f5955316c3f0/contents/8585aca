/**
 * Hook para gerenciar Eventos no Firestore
 * Sistema REVIS
 */

import { useMemo } from 'react';
import { useFirestore } from './useFirestore';
import { Evento } from '@/types';
import { orderBy } from 'firebase/firestore';

export function useEventos() {
  const constraints = useMemo(() => [orderBy('dataInicio', 'desc')], []);
  
  const firestore = useFirestore<Evento>({ 
    collectionName: 'eventos',
    queryConstraints: constraints,
  });

  return {
    ...firestore,
    eventos: firestore.data,
  };
}
