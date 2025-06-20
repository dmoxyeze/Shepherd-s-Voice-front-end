import { TPaginatedSermons, TSermon } from "@/types";
import { apiRequest, Endpoints } from "./api";

const getAllSermons = async (query: string) => {
  return await apiRequest<TPaginatedSermons>(
    "get",
    `/${Endpoints.sermon}?${query}`
  );
};

const getSermonById = async (id: string) => {
  return await apiRequest<TSermon>("get", `/${Endpoints.sermon}/${id}`);
};

export { getAllSermons, getSermonById };
