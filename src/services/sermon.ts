import { TPaginatedSermons, TSermon } from "@/types";
import { apiRequest, DataType, Endpoints } from "./api";

const getAllSermons = async (query: string) => {
  return await apiRequest<TPaginatedSermons>(
    "get",
    `/${Endpoints.sermon}?${query}`
  );
};

const getSermonById = async (id: string) => {
  return await apiRequest<DataType<TSermon>>(
    "get",
    `/${Endpoints.sermon}/${id}`
  );
};

export { getAllSermons, getSermonById };
