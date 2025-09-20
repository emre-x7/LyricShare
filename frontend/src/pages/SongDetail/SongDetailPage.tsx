import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { songService } from "../../services/songService";
import { commentService } from "../../services/commentService";
import CommentSection from "../../components/Comment/CommentSection";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import LikeButton from "../../components/Song/LikeButton";

const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const songId = parseInt(id!);

  const {
    data: song,
    isLoading: songLoading,
    error: songError,
  } = useQuery(["song", songId], () => songService.getSongById(songId));

  const { data: comments, isLoading: commentsLoading } = useQuery(
    ["comments", songId],
    () => commentService.getComments(songId),
    {
      enabled: !!songId,
    }
  );

  // Tüm şarkıları çekmek için yeni query
  const {
    data: allSongs,
    isLoading: allSongsLoading,
    error: allSongsError,
  } = useQuery(["all-songs"], () => songService.getAllSongs(), {
    enabled: !!songId, // Şarkı yüklendikten sonra çalışsın
  });

  if (songLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (songError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
            Şarkı yüklenirken hata oluştu: {(songError as Error).message}
          </div>
          <Link
            to="/"
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors group font-medium"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Ana sayfaya dön</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Şarkı bulunamadı
          </h2>
          <Link
            to="/"
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors group justify-center font-medium"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Ana sayfaya dön</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-8 transition-colors group"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Ana sayfaya dön</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Song Content */}
          <div className="lg:col-span-2">
            {/* Song Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      {song.title}
                    </h1>
                    <p className="text-2xl text-purple-100 mb-2 font-medium">
                      {song.artist}
                    </p>
                    <div className="flex items-center space-x-4 text-purple-200">
                      <span>
                        {song.authorFirstName} {song.authorLastName} tarafından
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(song.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center space-x-4">
                  <LikeButton
                    songId={song.id}
                    initialLiked={song.hasLiked}
                    likeCount={song.likeCount}
                    styled={true}
                  />

                  <div className="flex items-center space-x-2 px-6 py-3 bg-white/20 rounded-full">
                    <svg
                      className="w-5 h-5 text-white"
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
                    <span className="font-semibold">{song.commentCount}</span>
                    <span>Yorum</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Song Lyrics */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 dark:border-gray-700/50 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                Şarkı Sözleri
              </h2>

              <div className="relative">
                {/* Decorative quote marks */}
                <div className="absolute -top-4 -left-4 text-6xl text-purple-200 font-serif leading-none">
                  "
                </div>
                <div className="absolute -bottom-4 -right-4 text-6xl text-purple-200 font-serif leading-none rotate-180">
                  "
                </div>

                <div className="relative z-10 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 border-l-4 border-purple-400 dark:border-purple-500">
                  <pre className="whitespace-pre-line text-lg text-gray-800 dark:text-gray-300 leading-relaxed font-medium italic text-center">
                    {song.content}
                  </pre>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentSection
              songId={songId}
              comments={comments || []}
              isLoading={commentsLoading}
              styled={true}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Info */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Yazar Hakkında
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {song.authorFirstName[0]}
                    {song.authorLastName[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-lg">
                      {song.authorFirstName} {song.authorLastName}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">Şarkı Yazarı</p>
                  </div>
                </div>
                <Link
                  to={`/profile/${song.userId}`}
                  className="block w-full text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
                >
                  Profili Görüntüle
                </Link>
              </div>

              {/* Tüm Şarkılar Listesi */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Tüm Şarkılar
                </h3>

                {allSongsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : allSongsError ? (
                  <div className="text-center py-4 text-red-600 dark:text-red-400 text-sm">
                    Şarkılar yüklenirken hata oluştu
                  </div>
                ) : allSongs && allSongs.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {allSongs.map((songItem, index) => (
                      <Link
                        key={songItem.id}
                        to={`/song/${songItem.id}`}
                        className={`block group hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg p-3 transition-colors ${
                          songItem.id === songId
                            ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4
                              className={`font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors ${
                                songItem.id === songId
                                  ? "text-purple-700 dark:text-purple-300 font-semibold"
                                  : "text-gray-800 dark:text-white"
                              }`}
                            >
                              {songItem.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {songItem.artist}
                            </p>
                            {songItem.authorFirstName && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {songItem.authorFirstName}{" "}
                                {songItem.authorLastName}
                              </p>
                            )}
                          </div>
                          {songItem.id === songId && (
                            <div className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                              Şu an
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mt-2">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {songItem.likeCount || 0}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    Henüz şarkı bulunmamaktadır
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailPage;
