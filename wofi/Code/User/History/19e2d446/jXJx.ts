import dataProvider from "@refinedev/simple-rest";
import { API_URL } from "../constants";
import axios from "axios";
import { CrudFilter, CrudSort, MetaQuery, Pagination } from "@refinedev/core";

const httpClient = axios.create();

const baseDataProvider = dataProvider(API_URL, httpClient);

interface getListProps {
  resource: string,
  pagination: Pagination,
  filters: CrudFilter[],
  sorters: CrudSort[],
  meta: MetaQuery,
}


export const springDataProvider = {
  ...baseDataProvider,

  getList: async ({ resource, pagination, filters, sorters, meta }: getListProps) => {
    const url = `${baseDataProvider.getApiUrl()}/${resource}`;

    const query = {
      page: pagination?.current ? pagination.current - 1 : 0,
      size: pagination?.pageSize ?? 10,
    };

    const response = await httpClient.get(url, {
        params: query
    });


    const { content, totalElements } = response.data;

    return {
      data: content,
      total: totalElements,
    };
  },
};
