"use server";

import { 
  DataProvider,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteOneParams,
  GetListResponse,
  GetOneResponse,
  CreateResponse,
  UpdateResponse,
  DeleteOneResponse,
  CrudFilter,
  LogicalFilter,
  BaseRecord
} from "@refinedev/core";

import axios from "axios";

const API_URL = "http://localhost:8080/api";
const API_KEY = "";
const TOKEN_KEY = "SIGEP_UEMA";

interface AuthConfig {
  headers: {
    'Content-Type': string;
    'subscription-key': string;
    'Authorization': string;
  };
}

interface PaginatedResponse<T = BaseRecord> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

interface QueryParams {
  page: string;
  size: string;
  sort: string;
  [key: string]: string;
}

export const dataProvider = async (): DataProvider => {

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
  });

  const getAuthConfig = async (): Promise<AuthConfig> => {
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      headers: {
        'Content-Type': 'application/json',
        'subscription-key': API_KEY,
        'Authorization': `Bearer ${token || ''}`,
      },
    };
  };

  return {
    getList: async <TData extends BaseRecord = BaseRecord>({resource, pagination, filters, meta }: GetListParams): Promise<GetListResponse<TData>> => {
      const current = pagination?.currentPage || 1;
      const pageSize = pagination?.pageSize || 10;
      const field = meta?.sort?.field || "id";
      const order = meta?.sort?.order || "desc";

      const url = `${API_URL}/${resource}`;

      const params: QueryParams = {
        page: (current - 1).toString(),
        size: pageSize.toString(),
        sort: `${field},${order}`
      };

      if (filters && filters.length > 0) {
        filters.forEach((filter: CrudFilter) => {
          if (isLogicalFilter(filter)) {
            const filterValue: unknown = filter.value;
            if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
              switch (filter.operator) {
                case "contains":
                case "eq":
                  params[filter.field] = String(filterValue);
                  break;
                case "between":
                  if (filter.field === "createdAt" || filter.field === "updatedAt") {
                    if (Array.isArray(filterValue) && filterValue.length === 2) {
                      params[`${filter.field}Start`] = String(filterValue[0]);
                      params[`${filter.field}End`] = String(filterValue[1]);
                    }
                  }
                  break;
                default:
                  params[filter.field] = String(filterValue);
              }
            }
          }
        });
      }

      const config = await getAuthConfig();

      try {
        const response = await axiosInstance.get<PaginatedResponse<TData>>(url, { params, ...config });

        if (!response.data || !response.data.content) {
          return {data: [],total: 0,};
        }

        return {data: response.data.content, total: response.data.totalElements,};
      } catch (error: unknown) {
        console.error("API Error:", error);
        throw error;
      }
    },

    getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: GetOneParams): Promise<GetOneResponse<TData>> => {
      const url = `${API_URL}/${resource}/${id}`;
      const config = await getAuthConfig();

      try {
        const response = await axiosInstance.get<TData>(url, config);
        return { data: response.data };
      } catch (error: unknown) {
        console.error("GetOne Error:", error);
        throw error;
      }
    },

    create: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>({ resource, variables }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
      const config = await getAuthConfig();

      if (resource === 'v1/document' && isVariablesWithFile(variables)) {
        const url = `${API_URL}/${resource}`;
        
        if (variables.file) {
          const formData = new FormData();
          formData.append('file', variables.file);
          formData.append('data', JSON.stringify(variables));
          
          try {
            const response = await axiosInstance.post<TData>(url, formData, {
              headers: {
                'ocp-apim-subscription-key': API_KEY,
                'Authorization': config.headers.Authorization,
              }
            });
            return { data: response.data };
          } catch (error: unknown) {
            console.error("Create Error (with file):", error);
            throw error;
          }
        } else {
          const createUrl = `${API_URL}/${resource}/create`;
          try {
            const response = await axiosInstance.post<TData>(createUrl, variables, config);
            return { data: response.data };
          } catch (error: unknown) {
            console.error("Create Error (no file):", error);
            throw error;
          }
        }
      }

      const url = `${API_URL}/${resource}`;
      try {
        const response = await axiosInstance.post<TData>(url, variables, config);
        return { data: response.data };
      } catch (error: unknown) {
        console.error("Create Error:", error);
        throw error;
      }
    },

    update: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>({ resource, id, variables }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
      const requestBody: TVariables & { id: string | number } = {
        ...variables,
        id: id
      };
      
      const config = await getAuthConfig();
      const url = `${API_URL}/${resource}/${id}`;
      
      try {
        const response = await axiosInstance.put<TData>(url, requestBody, config);
        return { data: response.data };
      } catch (error: unknown) {
        console.error("Update Error:", error);
        throw error;
      }
    },

    deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, never>>({ resource, id }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
      const url = `${API_URL}/${resource}/${id}`;
      const config = await getAuthConfig();

      try {
        const response = await axiosInstance.delete<TData>(url, config);
        return { data: response.data };
      } catch (error: unknown) {
        console.error("Delete Error:", error);
        throw error;
      }
    },

    getApiUrl: (): string => API_URL,
  };
};

function isLogicalFilter(filter: CrudFilter): filter is LogicalFilter {
  return 'field' in filter && 'operator' in filter && 'value' in filter;
}

function isVariablesWithFile(variables: unknown): variables is { file?: File; url?: { fileName?: string } } {
  return typeof variables === 'object' && 
         variables !== null && 
         (hasFileProperty(variables) || hasUrlProperty(variables));
}

function hasFileProperty(obj: object): obj is { file: File } {
  return 'file' in obj && obj.file instanceof File;
}

function hasUrlProperty(obj: object): obj is { url?: { fileName?: string } } {
  return 'url' in obj && 
         typeof obj.url === 'object' && 
         obj.url !== null && 
         'fileName' in obj.url;
}
