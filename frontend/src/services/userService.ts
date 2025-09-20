import api from "./api";

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  roles: string[];
}

export interface UserStats {
  totalSongLyrics: number;
  totalLikesReceived: number;
  totalCommentsReceived: number;
  totalCommentsWritten: number;
  totalLikesGiven: number;
}

export interface UserActivity {
  recentSongs: Array<{ id: number; title: string; createdAt: string }>;
  recentComments: Array<{
    id: number;
    text: string;
    createdAt: string;
    songTitle: string;
  }>;
  recentLikes: Array<{ id: number; createdAt: string; songTitle: string }>;
}

export interface UserSongLyric {
  id: number;
  title: string;
  artist: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

// ✅ CHANGE PASSWORD DATA - EKLENDİ
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// ✅ DELETE ACCOUNT DATA - EKLENDİ
export interface DeleteAccountData {
  password: string;
}

export const userService = {
  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/profiles/${userId}`);
    return response.data;
  },

  async getUserStats(userId: number): Promise<UserStats> {
    const response = await api.get<UserStats>(`/profiles/${userId}/stats`);
    return response.data;
  },

  async getUserActivity(userId: number): Promise<UserActivity> {
    const response = await api.get<UserActivity>(
      `/profiles/${userId}/activity`
    );
    return response.data;
  },

  async getUserSongs(userId: number): Promise<UserSongLyric[]> {
    const response = await api.get<UserSongLyric[]>(
      `/profiles/${userId}/songlyrics`
    );
    return response.data;
  },

  async updateProfile(profileData: {
    firstName: string;
    lastName: string;
  }): Promise<void> {
    await api.put(`/profiles/me`, profileData);
  },

  // ✅ CHANGE PASSWORD - EKLENDİ
  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    await api.put("/profiles/me/changepassword", passwordData);
  },

  // ✅ DELETE ACCOUNT - EKLENDİ
  async deleteAccount(passwordData: DeleteAccountData): Promise<void> {
    await api.delete("/profiles/me", { data: passwordData });
  },
};
