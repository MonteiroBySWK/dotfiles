/**
 * Hook para gerenciar Alertas no Firestore
 * Sistema REVIS - REQ-04, REQ-15
 */

import { useMemo } from 'react';
import { useFirestore } from './useFirestore';
import { Alerta } from '@/types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

interface UseAlertasOptions {
  apenasNaoLidos?: boolean;
}

export function useAlertas(options: UseAlertasOptions = {}) {
  const { apenasNaoLidos } = options;
  
  const constraints = useMemo(() => {
    const result: QueryConstraint[] = [];

    if (apenasNaoLidos) {
      result.push(where('lido', '==', false));
    }

    result.push(orderBy('criadoEm', 'desc'));
    
    return result;
  }, [apenasNaoLidos]);

  const firestore = useFirestore<Alerta>({ 
    collectionName: 'alertas',
    queryConstraints: constraints,
  });

  const alertasNaoLidos = useMemo(
    () => firestore.data.filter(a => !a.lido),
    [firestore.data]
  );

  return {
    ...firestore,
    alertas: firestore.data,
    alertasNaoLidos,
  };
}
