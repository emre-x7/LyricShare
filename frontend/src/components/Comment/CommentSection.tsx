import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  commentService,
  CreateCommentData,
} from "../../services/commentService";
import { useAuth } from "../../contexts/AuthContext";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

interface CommentSectionProps {
  songId: number;
  comments: any[];
  isLoading: boolean;
  styled?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  songId,
  comments,
  isLoading,
  styled = false,
}) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation(
    (commentData: CreateCommentData) =>
      commentService.createComment(songId, commentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", songId]);
        queryClient.invalidateQueries(["song", songId]);
      },
    }
  );

  const handleCommentSubmit = (text: string) => {
    createCommentMutation.mutate({ text });
  };

  // Yeni tasarım için
  if (styled) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 dark:border-gray-700/50">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-purple-600 dark:text-white"
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
          Yorumlar ({comments.length})
        </h3>
        {isAuthenticated ? (
          <CommentForm
            onSubmit={handleCommentSubmit}
            isLoading={createCommentMutation.isLoading}
            styled={true}
          />
        ) : (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 mb-6">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Yorum yapmak için{" "}
              <a
                href="/login"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
              >
                giriş yapmalısınız
              </a>
            </p>
          </div>
        )}

        <CommentList
          songId={songId}
          comments={comments}
          isLoading={isLoading}
          styled={true}
        />
      </div>
    );
  }

  // Orijinal tasarım
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Yorumlar
      </h2>

      {isAuthenticated ? (
        <CommentForm
          onSubmit={handleCommentSubmit}
          isLoading={createCommentMutation.isLoading}
        />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            Yorum yapmak için{" "}
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              giriş yapmalısınız
            </a>
          </p>
        </div>
      )}

      <CommentList songId={songId} comments={comments} isLoading={isLoading} />
    </div>
  );
};

export default CommentSection;
