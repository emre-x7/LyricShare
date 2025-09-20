import React from "react";
import { Link } from "react-router-dom";
import { UserSongLyric } from "../../services/userService";
import LoadingSpinner from "../Common/LoadingSpinner";

interface UserSongsListProps {
  songs: UserSongLyric[] | undefined;
  isLoading: boolean;
  userId: number;
  isOwnProfile: boolean;
}

const UserSongsList: React.FC<UserSongsListProps> = ({
  songs,
  isLoading,
  userId,
  isOwnProfile,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {isOwnProfile ? "Şarkılarım" : "Şarkılar"}
      </h2>

      {songs?.length ? (
        <div className="space-y-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link
                    to={`/song/${song.id}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {song.title}
                  </Link>
                  <p className="text-gray-600">Sanatçı: {song.artist}</p>
                </div>

                <div className="text-right text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {song.likeCount}
                    </span>

                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
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
                      {song.commentCount}
                    </span>
                  </div>

                  <p className="text-xs mt-1">
                    {new Date(song.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {isOwnProfile
              ? "Henüz şarkı paylaşılmamış"
              : "Kullanıcı henüz şarkı paylaşmamış"}
          </p>
          {isOwnProfile && (
            <Link
              to="/song/new"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              İlk şarkını paylaş →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSongsList;
