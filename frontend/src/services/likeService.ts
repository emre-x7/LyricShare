import api from "./api";

export interface LikeResponse {
  liked: boolean;
  message: string;
}

export const likeService = {
  async toggleLike(songId: number): Promise<LikeResponse> {
    const response = await api.post<LikeResponse>(
      `/songlyrics/${songId}/likes`
    );
    return response.data;
  },

  async getLikes(songId: number): Promise<any[]> {
    const response = await api.get(`/songlyrics/${songId}/likes`);
    return response.data;
  },

  async getLikesCount(songId: number): Promise<number> {
    const response = await api.get<number>(`/songlyrics/${songId}/likes/count`);
    return response.data;
  },

  async checkUserLike(songId: number): Promise<boolean> {
    const response = await api.get<boolean>(
      `/songlyrics/${songId}/likes/check`
    );
    return response.data;
  },
};
