import axiosInstance from "../../axios/axios.interceptor";

export interface SendAdminOtpPayload {
  email: string;
}

export interface VerifyAdminOtpPayload {
  email: string;
  otp: string;
}

export interface AdminSignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AdminSignupResponse {
  success: boolean;
  message: string;
  data: {
    admin: Record<string, any>;
    accessToken: string;
  };
}

export const adminAuthService = {
  sendOtp: async (payload: SendAdminOtpPayload) => {
    const { data } = await axiosInstance.post("/admin/send-otp", payload);
    return data;
  },

  verifyOtp: async (payload: VerifyAdminOtpPayload) => {
    const { data } = await axiosInstance.post("/admin/verify-otp", payload);
    return data;
  },

  signup: async (payload: AdminSignupPayload): Promise<AdminSignupResponse> => {
    const { data } = await axiosInstance.post("/admin/signup", payload);
    return data;
  },
};