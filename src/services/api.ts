import { API_URL } from "@/config";
import axios, { AxiosProgressEvent, AxiosRequestHeaders } from "axios";

interface ApiRequestConfig {
  headers?: AxiosRequestHeaders;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: AbortSignal; // Add abort signal support
}

export type DataType<T> = {
  success: boolean;
  message: string;
  data: T;
  code: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  statusText: string;
};

export const controller = new AbortController();
const API = axios.create({
  baseURL: `${API_URL}`,
  timeout: 50000, // Set timeout to prevent hanging requests
});

export const handleCancelRequest = () => {
  controller.abort();
};

API.interceptors.request.use(async (request) => {
  // Only set Content-Type if it's not FormData
  if (request.data instanceof FormData) {
    request.headers.set("Content-Type", "multipart/form-data");
  }
  return request;
});

export const apiRequest = async <T>(
  method: "get" | "post" | "put" | "delete" | "patch" = "get",
  endpoint: string,
  data: unknown = {},
  config?: ApiRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    let finalMethod = method;
    let finalData = data;
    const headers = { ...config?.headers };

    // Detect FormData (for file upload or multipart request)
    if (data instanceof FormData) {
      if (method !== "post") {
        data.append("_method", method.toUpperCase());
        finalMethod = "post"; // Use POST and spoof method
      }

      headers["Content-Type"] = "multipart/form-data";
      finalData = data;
    }

    const response = await API[finalMethod]<T>(endpoint, finalData, {
      headers,
      onUploadProgress: config?.onUploadProgress,
      signal: config?.signal,
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return Promise.reject({
        message: "Request cancelled",
        isAborted: true,
      });
    }

    if (error.response) {
      return Promise.reject({
        ...error,
        message: error.response.data?.message || "Request failed",
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      return Promise.reject({
        message: "No response received from server",
        status: 0,
      });
    }

    return Promise.reject(error);
  }
};

export const Endpoints = {
  sermon: "sermons",
};

export default API;
