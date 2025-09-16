import React from "react";
import { useQuery } from "react-query";
import { songService, SongLyric } from "../../services/songService";
import SongCard from "../../components/Song/SongCard";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const HomePage: React.FC = () => {
  const {
    data: songs,
    isLoading,
    error,
  } = useQuery<SongLyric[]>("songs", songService.getAllSongs, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Şarkılar yüklenirken hata oluştu: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Tüm Şarkı Sözleri
      </h1>

      <div className="space-y-6">
        {songs?.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}

        {songs?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Henüz hiç şarkı sözü paylaşılmamış. İlk paylaşımı sen yap!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
