import apiClient from "./api";
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  User,
  UpdateProfileRequest,
} from "../types";

export const authService = {
  // 회원가입
  signup: async (data: SignupRequest): Promise<void> => {
    await apiClient.post("/signup", data);
  },

  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/login", data);
    return response.data;
  },

  // 내 정보 조회
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>("/me");
    return response.data;
  },

  // 프로필 업데이트
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>("/profile", data);
    return response.data;
  },
};
