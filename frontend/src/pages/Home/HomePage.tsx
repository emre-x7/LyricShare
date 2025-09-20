import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { songService, SongLyric } from "../../services/songService";
import LikeButton from "../../components/Song/LikeButton";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import "./../../styles/animations.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: songs,
    isLoading,
    error,
  } = useQuery("songs", songService.getAllSongs);

  const handleEditSong = (songId: number) => {
    navigate(`/song/edit/${songId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
            Şarkılar yüklenirken hata oluştu: {(error as Error).message}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              LyricShare
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Kalbin dilini paylaş, melodilerin ruhunu keşfet
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() =>
                  document
                    .getElementById("songs-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Keşfetmeye Başla
              </button>
              <button
                onClick={() => navigate("/song/new")}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                Şarkını Paylaş
              </button>
            </div>
          </div>
        </div>

        {/* Floating musical notes animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float-1 absolute top-20 left-10 text-4xl opacity-30">
            ♪
          </div>
          <div className="animate-float-2 absolute top-32 right-20 text-3xl opacity-25">
            ♫
          </div>
          <div className="animate-float-3 absolute bottom-20 left-1/4 text-5xl opacity-20">
            ♪
          </div>
          <div className="animate-float-1 absolute bottom-32 right-1/3 text-3xl opacity-35">
            ♬
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="songs-section" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Son Paylaşılan Şarkı Sözleri
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Müzik severlerin kalbiyle yazdığı en güzel sözleri keşfedin
          </p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {songs?.map((song, index) => (
            <div
              key={song.id}
              className={`animate-fade-in-up opacity-0 cursor-pointer`}
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: "forwards",
              }}
              onClick={() => navigate(`/song/${song.id}`)}
            >
              <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-white/50 dark:border-gray-700/50 hover:border-purple-200 dark:hover:border-purple-500 transform hover:scale-[1.02]">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-indigo-50/50 dark:from-gray-700/50 dark:via-gray-600/30 dark:to-gray-700/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {song.title}
                      </h3>
                      <p className="text-lg text-purple-600 dark:text-purple-400 font-medium mb-1">
                        {song.artist}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {song.authorFirstName} {song.authorLastName} tarafından
                        paylaşıldı
                      </p>
                    </div>

                    {/* Like Button  */}
                    <LikeButton
                      songId={song.id}
                      initialLiked={song.hasLiked}
                      likeCount={song.likeCount}
                    />
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border-l-4 border-purple-300 dark:border-purple-500">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-lg font-medium italic">
                        {song.content.split("\n").slice(0, 6).join("\n")}
                        {song.content.split("\n").length > 6 && "..."}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>{song.commentCount} yorum</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {new Date(song.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </span>
                    </div>

                    <button
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/song/${song.id}`);
                      }}
                    >
                      <span className="hidden sm:inline">Devamını Oku →</span>
                      <span className="sm:hidden">Devamı →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {songs?.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎵</div>
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-4">
              Henüz hiç şarkı sözü paylaşılmamış
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              İlk paylaşımı sen yap ve bu güzel yolculuğu başlat!
            </p>
            <button
              onClick={() => navigate("/song/new")}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              İlk Şarkını Paylaş
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
