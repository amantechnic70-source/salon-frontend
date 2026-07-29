import axiosInstance from "../axios/axiosInstance";
import {
    ApiResponse,
    CreateStaffPayload,
    GetStaffParams,
    Staff,
    UpdateStaffPayload,
    UpdateStaffStatusPayload,
} from "@/src/types/staff.types";

export const staffService = {
    // SALON OWNER

    create: (
        data: CreateStaffPayload
    ): Promise<{ data: ApiResponse<Staff> }> => {
        return axiosInstance.post("/staff/create", data);
    },

    getAll: (
        params?: GetStaffParams
    ): Promise<{ data: ApiResponse<Staff[]> }> => {
        return axiosInstance.get("/staff", { params });
    },

    getById: (
        id: string
    ): Promise<{ data: ApiResponse<Staff> }> => {
        return axiosInstance.get(`/staff/${id}`);
    },

    update: (
        id: string,
        data: UpdateStaffPayload
    ): Promise<{ data: ApiResponse<Staff> }> => {
        return axiosInstance.patch(`/staff/update/${id}`, data);
    },

    deleteStaff: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/staff/delete/${id}`);
    },

    // PUBLIC

    getStaffByBranch: (
        branchId: string
    ): Promise<{ data: ApiResponse<Staff[]> }> => {
        return axiosInstance.get(`/staff/branch/${branchId}`);
    },

    searchStaff: (
        params?: GetStaffParams
    ): Promise<{ data: ApiResponse<Staff[]> }> => {
        return axiosInstance.get("/staff/search/all", { params });
    },

    // SUPER ADMIN

    getAllStaffByAdmin: (
        params?: GetStaffParams
    ): Promise<{ data: ApiResponse<Staff[]> }> => {
        return axiosInstance.get("/staff/admin/all", { params });
    },

    updateStaffStatus: (
        id: string,
        data: UpdateStaffStatusPayload
    ): Promise<{ data: ApiResponse<Staff> }> => {
        return axiosInstance.patch(`/staff/admin/${id}/status`, data);
    },

    deleteStaffByAdmin: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/staff/admin/${id}`);
    },
};