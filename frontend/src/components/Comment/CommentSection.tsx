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
}

const CommentSection: React.FC<CommentSectionProps> = ({
  songId,
  comments,
  isLoading,
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Yorumlar</h2>

      {isAuthenticated ? (
        <CommentForm
          onSubmit={handleCommentSubmit}
          isLoading={createCommentMutation.isLoading}
        />
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-600">
            Yorum yapmak için{" "}
            <a href="/login" className="text-blue-600 hover:underline">
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
