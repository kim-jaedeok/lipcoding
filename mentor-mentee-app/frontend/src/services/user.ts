import apiClient from "./api";
import type { User, UpdateProfileRequest } from "../types";

export const userService = {
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

  // 프로필 이미지 업로드
  uploadProfileImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<{
      imageUrl: string;
      message: string;
    }>("/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
