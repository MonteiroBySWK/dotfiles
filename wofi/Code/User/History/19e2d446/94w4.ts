import dataProvider from "@refinedev/simple-rest";
import { API_URL } from "../constants";
import axios from "axios";

const httpClient = axios.create();

const baseDataProvider = dataProvider(API_URL, httpClient);

export const springDataProvider = {
  ...baseDataProvider,

  getList: async ({resource, pagination, filters, sorters, meta}) => {

  }
} 
