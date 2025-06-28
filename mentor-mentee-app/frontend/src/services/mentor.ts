import apiClient from "./api";
import type { Mentor } from "../types";

export const mentorService = {
  // 멘토 목록 조회
  getMentors: async (params?: {
    skill?: string;
    order_by?: "name" | "skill";
  }): Promise<Mentor[]> => {
    const response = await apiClient.get<Mentor[]>("/mentors", { params });
    return response.data;
  },
};
