import api from './api';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthMessageResponse {
  message: string;
}

export const authService = {
  forgotPassword: async (email: string): Promise<AuthMessageResponse> => {
    const { data } = await api.post<AuthMessageResponse>('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<AuthMessageResponse> => {
    const { data } = await api.post<AuthMessageResponse>('/auth/reset-password', { token, newPassword });
    return data;
  },
};

export default authService;
