import dataProvider from "@refinedev/simple-rest";
import { API_URL } from "../constants";
import axios from "axios";
import { CrudFilter, CrudSort, GetListParams, MetaQuery, Pagination } from "@refinedev/core";

const httpClient = axios.create();

const baseDataProvider = dataProvider(API_URL, httpClient);


export const apiDataProvider = {
  ...baseDataProvider,

  getList: async ({ resource, pagination, filters, sorters, meta }: GetListParams) => {
    const url = `${baseDataProvider.getApiUrl()}/${resource}`;

    const query = {
      page: pagination?.currentPage ? pagination.currentPage - 1 : 0,
      size: pagination?.pageSize ?? 10,
      ...meta,
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
