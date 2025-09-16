import api from "./api";

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  updatedAt?: string;
  songLyricId: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

export interface CreateCommentData {
  text: string;
}

export const commentService = {
  // Şarkıya ait yorumları getir
  async getComments(songId: number): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/songlyrics/${songId}/comments`);
    return response.data;
  },

  // Yeni yorum oluştur
  async createComment(
    songId: number,
    commentData: CreateCommentData
  ): Promise<Comment> {
    const response = await api.post<Comment>(
      `/songlyrics/${songId}/comments`,
      commentData
    );
    return response.data;
  },

  // Yorum güncelle
  async updateComment(
    songId: number,
    commentId: number,
    commentData: CreateCommentData
  ): Promise<void> {
    await api.put(`/songlyrics/${songId}/comments/${commentId}`, commentData);
  },

  // Yorum sil
  async deleteComment(songId: number, commentId: number): Promise<void> {
    await api.delete(`/songlyrics/${songId}/comments/${commentId}`);
  },
};
