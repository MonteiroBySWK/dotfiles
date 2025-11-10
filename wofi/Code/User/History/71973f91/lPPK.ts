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
/**
 * Hook para gerenciar Eventos no Firestore
 * Sistema REVIS
 */

import { useFirestore } from './useFirestore';
import { Evento } from '@/types';
import { orderBy } from 'firebase/firestore';

export function useEventos() {
  const firestore = useFirestore<Evento>({ 
    collectionName: 'eventos',
    queryConstraints: [orderBy('dataInicio', 'desc')],
  });

  return {
    ...firestore,
    eventos: firestore.data,
  };
}
