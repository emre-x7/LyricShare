import React from "react";
import { Link } from "react-router-dom";
import { SongLyric } from "../../services/songService";
import LikeButton from "./LikeButton";
import { useAuth } from "../../contexts/AuthContext";

interface SongCardProps {
  song: SongLyric;
  onEdit?: (songId: number) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onEdit }) => {
  const { user } = useAuth();
  const isOwner = user?.id === song.userId;
  const canEdit = isOwner || user?.roles?.includes("Admin");

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(song.id);
    }
  };

  return (
    <Link
      to={`/song/${song.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow hover:bg-gray-50 dark:hover:bg-gray-700 group relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {song.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sanatçı: {song.artist}</p>
        </div>
        <div onClick={handleLikeClick}>
          <LikeButton
            songId={song.id}
            initialLiked={song.hasLiked}
            likeCount={song.likeCount}
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line line-clamp-3">
          {song.content}
        </p>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex-1 min-w-0">
          <span className="font-medium truncate">
            {song.authorFirstName} {song.authorLastName}
          </span>
          <span> • {new Date(song.createdAt).toLocaleDateString("tr-TR")}</span>
        </div>

        <div className="flex space-x-4 ml-4" onClick={handleLikeClick}>
          <span className="flex items-center whitespace-nowrap">
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

          <span className="text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
            Devamını oku →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SongCard;
