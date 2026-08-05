import axiosInstance from "../axios/axiosInstance";
import {
    ApiResponse,
    CreateServicePayload,
    GetServicesParams,
    Service,
    UpdateServicePayload,
} from "@/src/types/service.types";

export const serviceService = {
    // SALON OWNER

    create: (
        data: CreateServicePayload
    ): Promise<{ data: ApiResponse<Service> }> => {
        return axiosInstance.post("/services/create", data);
    },

    getAll: (
        params?: GetServicesParams
    ): Promise<{ data: ApiResponse<Service[]> }> => {
        return axiosInstance.get("/services/all", { params });
    },

    getById: (
        id: string
    ): Promise<{ data: ApiResponse<Service> }> => {
        return axiosInstance.get(`/services/${id}`);
    },

    update: (
        id: string,
        data: UpdateServicePayload
    ): Promise<{ data: ApiResponse<Service> }> => {
        return axiosInstance.patch(`/services/update/${id}`, data);
    },

    deleteService: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/services/delete/${id}`);
    },

    // PUBLIC

    getByBranch: (
        branchId: string
    ): Promise<{ data: ApiResponse<Service[]> }> => {
        return axiosInstance.get(`/services/branch/${branchId}`);
    },

    getByCategory: (
        category: string
    ): Promise<{ data: ApiResponse<Service[]> }> => {
        return axiosInstance.get(`/services/category/${category}`);
    },

    getPopularServices: (): Promise<{ data: ApiResponse<Service[]> }> => {
        return axiosInstance.get("/services/popular/all");
    },

    searchServices: (
        params?: GetServicesParams
    ): Promise<{ data: ApiResponse<Service[]> }> => {
        return axiosInstance.get("/services/search/all", { params });
    },
};