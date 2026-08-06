import axiosInstance from "../axios/axiosInstance";
import {
    ApiResponse,
    Customer,
    CreateCustomerPayload,
    GetCustomersParams,
    UpdateCustomerPayload,
    UpdateCustomerStatusPayload,
} from "@/src/types/customer.types";

export const customerService = {
    // SALON OWNER

    create: (
        data: CreateCustomerPayload
    ): Promise<{ data: ApiResponse<Customer> }> => {
        return axiosInstance.post("/customers/create", data);
    },

    getAll: (
        params?: GetCustomersParams
    ): Promise<{ data: ApiResponse<Customer[]> }> => {
        return axiosInstance.get("/customers", { params });
    },

    getById: (
        id: string
    ): Promise<{ data: ApiResponse<Customer> }> => {
        return axiosInstance.get(`/customers/${id}`);
    },

    update: (
        id: string,
        data: UpdateCustomerPayload
    ): Promise<{ data: ApiResponse<Customer> }> => {
        return axiosInstance.patch(`/customers/update/${id}`, data);
    },

    deleteCustomer: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/customers/delete/${id}`);
    },

    // SUPER ADMIN

    getAllByAdmin: (
        params?: GetCustomersParams
    ): Promise<{ data: ApiResponse<Customer[]> }> => {
        return axiosInstance.get("/customers/admin/all", { params });
    },

    updateCustomerStatus: (
        id: string,
        data: UpdateCustomerStatusPayload
    ): Promise<{ data: ApiResponse<Customer> }> => {
        return axiosInstance.patch(`/customers/admin/${id}/status`, data);
    },

    deleteCustomerByAdmin: (
        id: string
    ): Promise<{ data: ApiResponse<null> }> => {
        return axiosInstance.delete(`/customers/admin/${id}`);
    },
};