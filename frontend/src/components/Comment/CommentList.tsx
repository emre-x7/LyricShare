import React from "react";
import CommentItem from "./CommentItem";
import LoadingSpinner from "../Common/LoadingSpinner";

interface CommentListProps {
  songId: number;
  comments: any[];
  isLoading: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  songId,
  comments,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Henüz yorum yapılmamış.
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} songId={songId} />
        ))
      )}
    </div>
  );
};

export default CommentList;
