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

const getCookie = async () => {
  
}

apiExternal.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }

    if (typeof window === "undefined") {
      const cookieStore = await cookies()
      
      try {
        const tokenCookie = cookies().then((cookies) =>
          cookies.get("auth-token")?.value
        );

        if (tokenCookie) {
          config.headers["Authorization"] = `Bearer ${tokenCookie}`;
        }
      } catch (e) {
        console.log(
          "Não foi possível ler cookies fora de um request. Isso pode ser normal."
        );
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
