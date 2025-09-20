import api from "./api";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  roles: string[];
  songCount: number;
}

export interface SystemStats {
  totalUsers: number;
  totalSongs: number;
  totalComments: number;
  totalLikes: number;
  recentSignups: User[];
  popularSongs: any[];
}

export interface UpdateRolesData {
  roles: string[];
}

export const adminService = {
  // Sistem istatistiklerini getir
  async getSystemStats(): Promise<SystemStats> {
    const response = await api.get<SystemStats>("/admin/stats");
    return response.data;
  },

  // Tüm kullanıcıları getir
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/admin/users");
    return response.data;
  },

  // Kullanıcı rolünü güncelle
  async updateUserRole(userId: number, roles: string[]): Promise<void> {
    await api.put(`/admin/users/${userId}/roles`, { roles });
  },

  // Şarkı sil (admin yetkisiyle)
  async deleteSong(songId: number): Promise<void> {
    await api.delete(`/admin/songs/${songId}`);
  },

  // Yorum sil (admin yetkisiyle)
  async deleteComment(commentId: number): Promise<void> {
    await api.delete(`/admin/comments/${commentId}`);
  },
};
