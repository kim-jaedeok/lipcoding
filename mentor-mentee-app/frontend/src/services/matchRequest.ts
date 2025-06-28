import apiClient from "./api";
import type { MatchRequest, CreateMatchRequestRequest } from "../types";
import { useAuthStore } from "../store/authStore";

export const matchRequestService = {
  // 매칭 요청 생성
  createRequest: async (
    data: CreateMatchRequestRequest
  ): Promise<{ id: number; status: string }> => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const requestData = {
      ...data,
      menteeId: user.id,
    };

    const response = await apiClient.post("/match-requests", requestData);
    return response.data;
  },

  // 받은 요청 목록 (멘토)
  getIncomingRequests: async (): Promise<MatchRequest[]> => {
    const response = await apiClient.get<MatchRequest[]>(
      "/match-requests/incoming"
    );
    return response.data;
  },

  // 보낸 요청 목록 (멘티)
  getOutgoingRequests: async (): Promise<MatchRequest[]> => {
    const response = await apiClient.get<MatchRequest[]>(
      "/match-requests/outgoing"
    );
    return response.data;
  },

  // 요청 수락
  acceptRequest: async (
    id: number
  ): Promise<{ id: number; status: string }> => {
    const response = await apiClient.put(`/match-requests/${id}/accept`);
    return response.data;
  },

  // 요청 거절
  rejectRequest: async (
    id: number
  ): Promise<{ id: number; status: string }> => {
    const response = await apiClient.put(`/match-requests/${id}/reject`);
    return response.data;
  },

  // 요청 취소
  cancelRequest: async (id: number): Promise<void> => {
    await apiClient.delete(`/match-requests/${id}`);
  },
};
