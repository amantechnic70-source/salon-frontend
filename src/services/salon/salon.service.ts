import {
    ApiResponse,
    CreateSalonPayload,
    GetSalonsParams,
    Salon,
    UpdateSalonPayload,
    UpdateSalonStatusPayload,
} from "@/src/types/salon.types";
import axiosInstance from "../axios/axiosInstance";

export const salonService = {
    // SALON OWNER

    createSalon: (
        data: CreateSalonPayload
    ): Promise<{ data: ApiResponse<Salon> }> => {
        return axiosInstance.post("/salons/create", data);
    },

    getProfile: (): Promise<{ data: ApiResponse<Salon> }> => {
        return axiosInstance.get("/salons/profile");
    },

    updateSalon: (
        data: UpdateSalonPayload
    ): Promise<{ data: ApiResponse<Salon> }> => {
        return axiosInstance.patch("/salons/update", data);
    },

    deleteSalon: (): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete("/salons/delete");
    },

    // PUBLIC

    getAllSalons: (
        params?: GetSalonsParams
    ): Promise<{ data: ApiResponse<Salon[]> }> => {
        return axiosInstance.get("/salons", { params });
    },

    searchSalons: (
        params?: GetSalonsParams
    ): Promise<{ data: ApiResponse<Salon[]> }> => {
        return axiosInstance.get("/salons/search", { params });
    },

    getSalonByCity: (
        city: string
    ): Promise<{ data: Salon[] }> => {
        return axiosInstance.get(`/salons/city/${city}`);
    },

    getSalonById: (
        id: string
    ): Promise<{ data: ApiResponse<Salon> }> => {
        return axiosInstance.get(`/salons/${id}`);
    },

    // SUPER ADMIN

    getAllSalonsByAdmin: (
        params?: GetSalonsParams
    ): Promise<{ data: Salon[] }> => {
        return axiosInstance.get("/salons/admin/all", { params });
    },

    updateSalonStatus: (
        id: string,
        data: UpdateSalonStatusPayload
    ): Promise<{ data: ApiResponse<Salon> }> => {
        return axiosInstance.patch(`/salons/admin/${id}/status`, data);
    },

    deleteSalonByAdmin: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/salons/admin/${id}`);
    },
};