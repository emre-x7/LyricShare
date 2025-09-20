import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { likeService } from "../../services/likeService";

interface LikeButtonProps {
  songId: number;
  initialLiked: boolean;
  likeCount: number;
  styled?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  songId,
  initialLiked,
  likeCount,
  styled = false,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const queryClient = useQueryClient();

  const likeMutation = useMutation(() => likeService.toggleLike(songId), {
    onSuccess: (data) => {
      setIsLiked(data.liked);
      setCurrentLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      queryClient.invalidateQueries("songs");
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeMutation.mutate();
  };

  // Yeni tasarım için stil
  if (styled) {
    return (
      <button
        onClick={handleLike}
        disabled={likeMutation.isLoading}
        className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
          isLiked
            ? "bg-red-500 dark:bg-red-600 text-white shadow-lg"
            : "bg-white/20 dark:bg-gray-700/20 text-white dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-600/30"
        } ${isAnimating ? "scale-110" : "scale-100"} ${
          likeMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <svg
          className="w-5 h-5"
          fill={isLiked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className="font-semibold">{currentLikeCount}</span>
        <span>Beğeni</span>
      </button>
    );
  }

  // Orijinal tasarım
  return (
    <button
      onClick={handleLike}
      disabled={likeMutation.isLoading}
      className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all transform ${
        isLiked
          ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30"
          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      } ${isAnimating ? "scale-110" : "scale-100"} ${
        likeMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <svg
        className={`w-5 h-5 transition-all ${
          isAnimating ? "scale-125" : "scale-100"
        }`}
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{currentLikeCount}</span>
    </button>
  );
};

export default LikeButton;
