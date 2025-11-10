import dataProvider from "@refinedev/simple-rest";
import { API_URL } from "../constants";
import axios from "axios";

const httpClient = axios.create();

const baseDataProvider = dataProvider(API_URL, httpClient);

export const springDataProvider = {
  ...baseDataProvider,

  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${baseDataProvider.getApiUrl()}/${resource}`;

    const query = {
      page: pagination?.current ? pagination.current - 1 : 0, // Spring é 0-based
      size: pagination?.pageSize ?? 10,
    };
  },
};
