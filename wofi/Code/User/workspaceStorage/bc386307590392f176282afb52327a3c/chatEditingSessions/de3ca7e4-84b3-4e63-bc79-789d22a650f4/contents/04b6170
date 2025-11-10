import { useState, useEffect } from 'react';
import { ReadHealthDataDTO } from '@/lib/api-client';
import { mockHealthDataManager } from '@/lib/mock-data';

export function useMockHealthData(employeeId: string) {
  const [healthData, setHealthData] = useState<ReadHealthDataDTO | null>(null);

  useEffect(() => {
    const stream = mockHealthDataManager.getStream(employeeId);
    const unsubscribe = stream.onData((data) => {
      setHealthData(data);
    });

    // Iniciar o stream
    stream.start();

    // Cleanup
    return () => {
      unsubscribe();
      stream.stop();
    };
  }, [employeeId]);

  return healthData;
}

export function useMultiMockHealthData(employeeIds: string[]) {
  const [healthDataMap, setHealthDataMap] = useState<Record<string, ReadHealthDataDTO>>({});

  useEffect(() => {
    const streams = employeeIds.map(id => mockHealthDataManager.getStream(id));
    const unsubscribes = streams.map((stream, index) => {
      const employeeId = employeeIds[index];
      return stream.onData((data) => {
        setHealthDataMap(prev => ({
          ...prev,
          [employeeId]: data
        }));
      });
    });

    // Iniciar todos os streams
    streams.forEach(stream => stream.start());

    // Cleanup
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
      streams.forEach(stream => stream.stop());
    };
  }, [employeeIds.join(',')]);

  return healthDataMap;
}
