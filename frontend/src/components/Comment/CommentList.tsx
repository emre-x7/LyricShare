import React from "react";
import CommentItem from "./CommentItem";
import LoadingSpinner from "../Common/LoadingSpinner";

interface CommentListProps {
  songId: number;
  comments: any[];
  isLoading: boolean;
  styled?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  songId,
  comments,
  isLoading,
  styled = false,
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Yeni tasarım için
  if (styled) {
    return (
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-500 text-lg mb-2">Henüz yorum yapılmamış</p>
            <p className="text-gray-400">İlk yorumu sen yap!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              songId={songId}
              styled={true}
            />
          ))
        )}
      </div>
    );
  }

  // Orijinal tasarım
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
