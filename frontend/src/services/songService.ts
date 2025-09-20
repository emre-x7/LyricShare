import api from "./api";

export interface SongLyric {
  id: number;
  title: string;
  artist: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  authorFirstName: string;
  authorLastName: string;
  authorEmail: string;
  likeCount: number;
  commentCount: number;
  hasLiked: boolean;
  userId: number;
}

export interface CreateSongData {
  title: string;
  artist: string;
  content: string;
}

export interface UpdateSongData {
  title: string;
  artist: string;
  content: string;
}
export const songService = {
  // Tüm şarkıları getir
  async getAllSongs(): Promise<SongLyric[]> {
    const response = await api.get<SongLyric[]>("/songlyrics");
    return response.data;
  },

  // Tekil şarkı getir
  async getSongById(id: number): Promise<SongLyric> {
    const response = await api.get<SongLyric>(`/songlyrics/${id}`);
    return response.data;
  },

  // Yeni şarkı oluştur
  async createSong(songData: CreateSongData): Promise<SongLyric> {
    const response = await api.post<SongLyric>("/songlyrics", songData);
    return response.data;
  },

  // Şarkı güncelle
  async updateSong(id: number, songData: UpdateSongData): Promise<void> {
    await api.put(`/songlyrics/${id}`, songData);
  },

  // Şarkı sil
  async deleteSong(id: number): Promise<void> {
    await api.delete(`/songlyrics/${id}`);
  },
};
