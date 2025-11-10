/**
 * Hook para gerenciar Alertas no Firestore
 * Sistema REVIS - REQ-04, REQ-15
 */

import { useMemo } from 'react';
import { useFirestore } from './useFirestore';
import { Alerta } from '@/types';
import { orderBy } from 'firebase/firestore';

interface UseAlertasOptions {
  apenasNaoLidos?: boolean;
}

export function useAlertas(options: UseAlertasOptions = {}) {
  const { apenasNaoLidos = false } = options;
  
  // Buscar todos os alertas ordenados (sem where para evitar índice composto)
  const constraints = useMemo(() => {
    return [orderBy('criadoEm', 'desc')];
  }, []);

  const firestore = useFirestore<Alerta>({ 
    collectionName: 'alertas',
    queryConstraints: constraints,
  });

  // Filtrar no client-side
  const alertasFiltrados = useMemo(() => {
    if (!apenasNaoLidos) return firestore.data;
    return firestore.data.filter(a => !a.lido);
  }, [firestore.data, apenasNaoLidos]);

  const alertasNaoLidos = useMemo(
    () => firestore.data.filter(a => !a.lido),
    [firestore.data]
  );

  return {
    ...firestore,
    alertas: alertasFiltrados,
    data: alertasFiltrados,
    alertasNaoLidos,
  };
}
