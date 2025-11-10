import axios from "axios";
import { cookies } from "next/headers";

/* Não usar isso fora do Server Side */
export const apiExternal = axios.create({
  baseURL: `${process.env.NEST_API_URL}`,
  headers: { "Content-Type": "application/json" },
});

apiExternal.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[External API Error]", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

apiExternal.interceptors.request.use(
  (async (config: Axios.AxiosXHRConfig<any>) => {
    if (typeof window !== "undefined") {
      return config;
    }

    try {
      const cookieStore = await cookies();
      const tokenCookie =  "" // cookieStore.get("auth-token")?.value;

      if (tokenCookie && config.headers) {
        config.headers.Authorization = `Bearer ${tokenCookie}`;
      }
    } catch (e) {
      // Isso é esperado se o módulo for usado fora do ciclo de requisição/resposta.
      console.log(
        "Não foi possível ler cookies (normal fora de um request):",
        (e as Error).message
      );
    }

    return config;
  }) as any,
  (error) => {
    return Promise.reject(error);
  }
);
