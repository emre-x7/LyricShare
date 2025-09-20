import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  message: string;
}

export const authService = {
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", loginData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        registerData
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    // Token'ı local storage'dan temizle
    localStorage.removeItem("token");
  },
};

