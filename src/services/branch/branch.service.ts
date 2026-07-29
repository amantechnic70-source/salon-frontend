import axiosInstance from "../axios/axiosInstance";
import {
    ApiResponse,
    Branch,
    CreateBranchPayload,
    GetBranchesParams,
    UpdateBranchPayload,
    UpdateBranchStatusPayload,
} from "@/src/types/branch.types";

export const branchService = {
    // SALON OWNER

    create: (
        data: CreateBranchPayload
    ): Promise<{ data: ApiResponse<Branch> }> => {
        return axiosInstance.post("/branches/create", data);
    },

    getAll: (
        params?: GetBranchesParams
    ): Promise<{ data: ApiResponse<Branch[]> }> => {
        return axiosInstance.get("/branches", { params });
    },

    getById: (
        id: string
    ): Promise<{ data: ApiResponse<Branch> }> => {
        return axiosInstance.get(`/branches/${id}`);
    },

    update: (
        id: string,
        data: UpdateBranchPayload
    ): Promise<{ data: ApiResponse<Branch> }> => {
        return axiosInstance.patch(`/branches/update/${id}`, data);
    },

    deleteBranch: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/branches/delete/${id}`);
    },

    // PUBLIC

    searchBranches: (
        params?: GetBranchesParams
    ): Promise<{ data: ApiResponse<Branch[]> }> => {
        return axiosInstance.get("/branches/search/all", { params });
    },

    getBranchesByCity: (
        city: string
    ): Promise<{ data: ApiResponse<Branch[]> }> => {
        return axiosInstance.get(`/branches/city/${city}`);
    },

    getBranchesBySalon: (
        salonId: string
    ): Promise<{ data: ApiResponse<Branch[]> }> => {
        return axiosInstance.get(`/branches/salon/${salonId}`);
    },

    // SUPER ADMIN

    getAllBranchesByAdmin: (
        params?: GetBranchesParams
    ): Promise<{ data: ApiResponse<Branch[]> }> => {
        return axiosInstance.get("/branches/admin/all", { params });
    },

    updateBranchStatus: (
        id: string,
        data: UpdateBranchStatusPayload
    ): Promise<{ data: ApiResponse<Branch> }> => {
        return axiosInstance.patch(`/branches/admin/${id}/status`, data);
    },

    deleteBranchByAdmin: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/branches/admin/${id}`);
    },
};