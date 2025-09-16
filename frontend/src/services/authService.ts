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
    console.log("Login attempt:", loginData);
    try {
      const response = await api.post<AuthResponse>("/auth/login", loginData);
      console.log("Login success:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data);
      throw error;
    }
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    console.log("Register attempt:", registerData);
    try {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        registerData
      );
      console.log("Register success:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Register error:", error.response?.data);
      throw error;
    }
  },

  async logout(): Promise<void> {
    // Token'ı local storage'dan temizle
    localStorage.removeItem("token");
  },
};

export {};
