import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/apiClient";

type ResponseDataApi<T> = { data: T; meta?: any };

type ReturnCreateResourseHook<TData, TCreate, TUpdate> = {
  (): {
    data: TData[] | null;
    loading: boolean;
    error: string | null;
    actions: {
      load: () => Promise<TData>;
      create: (payload: TCreate) => Promise<TData>;
      update: (payload: TUpdate) => Promise<TData>;
      remove: () => Promise<void>;
    };
  };
  (id: string | null): {
    data: TData | null;
    loading: boolean;
    error: string | null;
    actions: {
      load: () => Promise<TData>;
      create: (payload: TCreate) => Promise<TData>;
      update: (payload: TUpdate) => Promise<TData>;
      remove: () => Promise<void>;
    };
  };
};

function toMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const anyErr = err as any;
    return (
      anyErr?.response?.data?.error ||
      anyErr?.response?.data?.message ||
      anyErr?.message ||
      "Erro inesperado"
    );
  }
  return String(err) || "Erro inesperado";
}

// Factory function que cria hooks específicos
export function createResourceHook<TData, TCreate = any, TUpdate = any>(
  baseEndpoint: string, params?: {}
): ReturnCreateResourseHook<TData, TCreate, TUpdate> {
  return function useResource(id?: string | null) {
    const endpoint = id ? `${baseEndpoint}/${id}` : baseEndpoint;
    const isList = !id;

    const [data, setData] = useState<TData | TData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const load = useCallback(async (): Promise<TData | TData[]> => {
      if (!endpoint) throw new Error("Endpoint não definido");

      setLoading(true);
      setError(null);
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await apiClient.get<ResponseDataApi<TData | TData[]>>(
          endpoint
        );
        setData(res.data.data);
        return res.data.data;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(toMessage(err));
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
          const res = await apiClient.post<ResponseDataApi<TData>>(
            baseEndpoint,
            payload
          );
          await load(); // Recarrega após criação
          return res.data.data;
        } catch (err) {
          setError(toMessage(err));
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [baseEndpoint, load]
    );

    const update = useCallback(
      async (payload: TUpdate): Promise<TData> => {
        if (!id) throw new Error("ID não fornecido para update");

        setLoading(true);
        setError(null);

        try {
          const res = await apiClient.put<ResponseDataApi<TData>>(
            endpoint,
            payload
          );
          await load(); // Recarrega após update
          return res.data.data;
        } catch (err) {
          setError(toMessage(err));
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [endpoint, id, load]
    );

    const remove = useCallback(async (): Promise<void> => {
      if (!id) throw new Error("ID não fornecido para remove");

      setLoading(true);
      setError(null);

      try {
        await apiClient.delete(endpoint);
        await load(); // Recarrega após remoção
      } catch (err) {
        setError(toMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    }, [endpoint, id, load]);

    useEffect(() => {
      if (endpoint) {
        load();
      }

      return () => {
        abortRef.current?.abort();
      };
    }, [load, endpoint]);

    if (isList) {
      return {
        data: data as TData[] | null,
        loading,
        error,
        actions: {
          load: load as () => Promise<TData[]>,
          create,
          update,
          remove,
        },
      };
    } else {
      return {
        data: data as TData | null,
        loading,
        error,
        actions: {
          load: load as () => Promise<TData>,
          create,
          update,
          remove,
        },
      };
    }
  } as ReturnCreateResourseHook<TData, TCreate, TUpdate>; // Cast final para garantir a tipagem
}
