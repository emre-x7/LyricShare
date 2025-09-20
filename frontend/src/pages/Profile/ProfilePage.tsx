import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import {
  userService,
  UserProfile,
  UserStats,
  UserActivity,
  UserSongLyric,
} from "../../services/userService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("songs");

  const profileUserId = userId ? parseInt(userId) : currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id?.toString();

  // Kullanıcı profil bilgilerini çek
  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery(
    ["userProfile", profileUserId],
    () => userService.getUserProfile(profileUserId!),
    {
      enabled: !!profileUserId,
    }
  );

  // İstatistikleri çek
  const { data: userStats, isLoading: statsLoading } = useQuery(
    ["userStats", profileUserId],
    () => userService.getUserStats(profileUserId!),
    {
      enabled: !!profileUserId,
    }
  );

  // Aktivite geçmişini çek
  const { data: userActivity, isLoading: activityLoading } = useQuery(
    ["userActivity", profileUserId],
    () => userService.getUserActivity(profileUserId!),
    {
      enabled: !!profileUserId,
    }
  );

  // Kullanıcının şarkılarını çek
  const { data: userSongs, isLoading: songsLoading } = useQuery(
    ["userSongs", profileUserId],
    () => userService.getUserSongs(profileUserId!),
    {
      enabled: !!profileUserId,
    }
  );

  const isLoading =
    profileLoading || statsLoading || activityLoading || songsLoading;

  if (!profileUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Profil bulunamadı
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
            Profil yüklenirken hata oluştu: {(profileError as Error).message}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
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
          <span className="font-medium">Geri dön</span>
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white/20 rounded-full"></div>
          <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-white/30 rounded-full"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm border border-white/20 shadow-2xl">
                {userProfile?.firstName?.[0]}
                {userProfile?.lastName?.[0]}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {userProfile?.firstName} {userProfile?.lastName}
              </h1>
              <p className="text-xl text-purple-100 mb-2">
                {userProfile?.email}
              </p>
              <p className="text-purple-200 mb-4">
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString("tr-TR")
                  : "Bilinmiyor"}{" "}
                tarihinde katıldı
              </p>

              {/* Role Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {userProfile?.roles?.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30"
                  >
                    {role === "User" ? "Şarkı Yazarı" : role}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              {isOwnProfile && (
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Link
                    to="/profile/edit"
                    className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Profili Düzenle
                  </Link>
                  <Link
                    to="/song/new"
                    className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Yeni Şarkı Ekle
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold">
                  {userStats?.totalSongLyrics || 0}
                </div>
                <div className="text-sm text-purple-100">Şarkı</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold">
                  {userStats?.totalLikesReceived || 0}
                </div>
                <div className="text-sm text-purple-100">Beğeni</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50 mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                İstatistikler
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    Toplam Şarkı
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">
                    {userStats?.totalSongLyrics || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    Alınan Beğeni
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-xl">
                    {userStats?.totalLikesReceived || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    Alınan Yorum
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-xl">
                    {userStats?.totalCommentsReceived || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    Yazılan Yorum
                  </span>
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-xl">
                    {userStats?.totalCommentsWritten || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    Verilen Beğeni
                  </span>
                  <span className="font-bold text-red-600 dark:text-red-400 text-xl">
                    {userStats?.totalLikesGiven || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity Preview */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Son Aktiviteler
              </h3>

              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Son Şarkı</p>
                  <p className="text-purple-600 dark:text-purple-400">
                    {userActivity?.recentSongs?.[0]?.title || "Henüz yok"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userActivity?.recentSongs?.[0]?.createdAt
                      ? new Date(
                          userActivity.recentSongs[0].createdAt
                        ).toLocaleDateString("tr-TR")
                      : ""}
                  </p>
                </div>

                <hr className="border-gray-200 dark:border-gray-600" />

                <div className="text-sm">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Son Yorum</p>
                  <p className="text-gray-600 dark:text-gray-400 truncate">
                    {userActivity?.recentComments?.[0]?.text || "Henüz yok"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userActivity?.recentComments?.[0]?.songTitle
                      ? `${userActivity.recentComments[0].songTitle} adlı şarkıda`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setActiveTab("songs")}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                    activeTab === "songs"
                      ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    <span>{isOwnProfile ? "Şarkılarım" : "Şarkıları"}</span>
                    <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                      {userSongs?.length || 0}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("activity")}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                    activeTab === "activity"
                      ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Aktivite</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "songs" && (
              <div className="space-y-6">
                {userSongs?.map((song, index) => (
                  <div
                    key={song.id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer animate-fade-in"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                    onClick={() => navigate(`/song/${song.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors mb-2">
                          {song.title}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-400 font-medium mb-1">
                          {song.artist}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {new Date(song.createdAt).toLocaleDateString("tr-TR")}{" "}
                          tarihinde paylaşıldı
                        </p>
                      </div>

                      {/* Song Stats */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="font-medium">{song.likeCount}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4 text-blue-500"
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
                          <span className="font-medium">
                            {song.commentCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/song/${song.id}`);
                        }}
                        className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
                      >
                        Görüntüle
                      </button>
                      {isOwnProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/song/edit/${song.id}`);
                          }}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                        >
                          Düzenle
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {(!userSongs || userSongs.length === 0) && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/50 dark:border-gray-700/50 text-center">
                    <div className="text-6xl mb-6">🎵</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      {isOwnProfile
                        ? "Henüz şarkı paylaşılmamış"
                        : "Bu kullanıcı henüz şarkı paylaşmamış"}
                    </h3>
                    {isOwnProfile && (
                      <Link
                        to="/song/new"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold inline-block"
                      >
                        İlk Şarkını Paylaş
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                {/* Recent Songs */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    Son Paylaşılan Şarkılar
                  </h3>

                  <div className="space-y-3">
                    {userActivity?.recentSongs?.map((song) => (
                      <div
                        key={song.id}
                        className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all cursor-pointer"
                        onClick={() => navigate(`/song/${song.id}`)}
                      >
                        <span className="font-medium text-gray-800 dark:text-white">
                          {song.title}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(song.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    ))}
                    {(!userActivity?.recentSongs ||
                      userActivity.recentSongs.length === 0) && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        Henüz şarkı paylaşılmamış
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Comments */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-600"
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
                    Son Yorumlar
                  </h3>

                  <div className="space-y-4">
                    {userActivity?.recentComments?.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-700/50 dark:to-purple-900/20 rounded-lg"
                      >
                        <p className="text-gray-700 dark:text-gray-300 mb-2">"{comment.text}"</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {comment.songTitle}
                          </span>
                          <span>
                            {new Date(comment.createdAt).toLocaleDateString(
                              "tr-TR"
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!userActivity?.recentComments ||
                      userActivity.recentComments.length === 0) && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        Henüz yorum yapılmamış
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Likes */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    Son Beğeniler
                  </h3>

                  <div className="space-y-3">
                    {userActivity?.recentLikes?.map((like) => (
                      <div
                        key={like.id}
                        className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all cursor-pointer"
                        onClick={() => navigate(`/song/${like.songTitle}`)}
                      >
                        <span className="font-medium text-gray-800 dark:text-white">
                          {like.songTitle}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(like.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    ))}
                    {(!userActivity?.recentLikes ||
                      userActivity.recentLikes.length === 0) && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        Henüz beğeni yapılmamış
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
