/**
 * Hook para gerenciar Alertas no Firestore
 * Sistema REVIS - REQ-04, REQ-15
 */

import { useFirestore } from './useFirestore';
import { Alerta } from '@/types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

interface UseAlertasOptions {
  apenasNaoLidos?: boolean;
}

export function useAlertas(options: UseAlertasOptions = {}) {
  const constraints: QueryConstraint[] = [];

  if (options.apenasNaoLidos) {
    constraints.push(where('lido', '==', false));
  }

  constraints.push(orderBy('criadoEm', 'desc'));

  const firestore = useFirestore<Alerta>({ 
    collectionName: 'alertas',
    queryConstraints: constraints,
  });

  return {
    ...firestore,
    alertas: firestore.data,
    alertasNaoLidos: firestore.data.filter(a => !a.lido),
  };
}
