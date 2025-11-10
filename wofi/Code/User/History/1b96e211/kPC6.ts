// src/hooks/createResourceHook.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/apiClient";

type ResponseDataApi<T> = { 
  success: boolean;
  message: string;
  data: T; 
};

export function createResourceHook<TData = any, TCreate = any, TUpdate = any>(
  baseEndpoint: string
) {
  return function useResource(id?: string) {
    const endpoint = id ? `${baseEndpoint}/${id}` : baseEndpoint;

    const [data, setData] = useState<TData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<any>(null); // ✅ Adicionado meta
    const abortRef = useRef<AbortController | null>(null);

    const load = useCallback(async (queryParams?: Record<string, any>): Promise<TData> => {
      setLoading(true);
      setError(null);
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        // Constrói a URL com query params se existirem
        let url = endpoint;
        if (queryParams && Object.keys(queryParams).length > 0) {
          const params = new URLSearchParams();
          Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.set(key, String(value));
            }
          });
          const queryString = params.toString();
          if (queryString) {
            url = `${endpoint}?${queryString}`;
          }
        }

        const res = await apiClient.get<ResponseDataApi<any>>(url, {
          signal: abortRef.current.signal,
        });

        // ✅ Separa data principal de meta
        const responseData = res.data.data;
        
        // Se responseData tem uma propriedade que parece ser o array principal (ex: projects)
        // e outras propriedades (total, page, pageSize), separamos
        let mainData: TData;
        let metadata: any = {};

        // Detecta se há chaves além do array de dados
        const keys = Object.keys(responseData || {});
        const dataKey = keys.find(k => Array.isArray(responseData[k])); // busca array (ex: 'projects')
        
        if (dataKey) {
          // Tem estrutura { projects: [...], total: N, page: 1, pageSize: 10 }
          mainData = responseData[dataKey] as TData;
          
          // Captura tudo que não for o array principal como meta
          metadata = Object.keys(responseData).reduce((acc, key) => {
            if (key !== dataKey) {
              acc[key] = responseData[key];
            }
            return acc;
          }, {} as any);
        } else {
          // Estrutura simples (ex: { project: {...} })
          mainData = responseData as TData;
          metadata = null;
        }

        setData(mainData);
        setMeta(metadata);
        
        return mainData;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          const message = err?.response?.data?.message || err?.message || "Erro inesperado";
          setError(message);
        }
        throw err;
      } finally {
        setLoading(false);
      }
    }, [endpoint]);

    const create = useCallback(
      async (payload: TCreate): Promise<TData> => {
        setLoading(true);
        setError(null);

        try {
          const res = await apiClient.post<ResponseDataApi<any>>(
            baseEndpoint,
            payload
          );
          
          // Mesma lógica de separação
          const responseData = res.data.data;
          const keys = Object.keys(responseData || {});
          const dataKey = keys.find(k => typeof responseData[k] === 'object' && !Array.isArray(responseData[k]));
          
          const mainData = dataKey ? responseData[dataKey] : responseData;
          
          await load(); // Recarrega após criação
          return mainData;
        } catch (err: any) {
          const message = err?.response?.data?.message || err?.message || "Erro inesperado";
          setError(message);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [baseEndpoint, load]
    );

    const update = useCallback(
      async (updateId: string, payload: TUpdate): Promise<TData> => {
        setLoading(true);
        setError(null);

        try {
          const res = await apiClient.put<ResponseDataApi<any>>(
            `${baseEndpoint}/${updateId}`,
            payload
          );
          
          const responseData = res.data.data;
          const keys = Object.keys(responseData || {});
          const dataKey = keys.find(k => typeof responseData[k] === 'object' && !Array.isArray(responseData[k]));
          
          const mainData = dataKey ? responseData[dataKey] : responseData;
          
          await load(); // Recarrega após update
          return mainData;
        } catch (err: any) {
          const message = err?.response?.data?.message || err?.message || "Erro inesperado";
          setError(message);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [baseEndpoint, load]
    );

    const remove = useCallback(async (removeId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.delete(`${baseEndpoint}/${removeId}`);
        await load(); // Recarrega após remoção
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || "Erro inesperado";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    }, [baseEndpoint, load]);

    // Auto-load na montagem (sem query params)
    useEffect(() => {
      load();

      return () => {
        abortRef.current?.abort();
      };
    }, [endpoint]);

    return {
      data,
      loading,
      error,
      meta, // ✅ Expõe meta
      actions: {
        load,
        create,
        update,
        remove,
      },
    };
  };
}