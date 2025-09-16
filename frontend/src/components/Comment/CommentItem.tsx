import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { commentService } from "../../services/commentService";
import { useAuth } from "../../contexts/AuthContext";

interface CommentItemProps {
  comment: any;
  songId: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, songId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isOwner = user?.id === comment.userId;
  const canEdit = isOwner || user?.roles?.includes("Admin");

  const deleteMutation = useMutation(
    () => commentService.deleteComment(songId, comment.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", songId]);
        queryClient.invalidateQueries(["song", songId]);
      },
    }
  );

  const updateMutation = useMutation(
    () => commentService.updateComment(songId, comment.id, { text: editText }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", songId]);
        setIsEditing(false);
      },
    }
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Yorumu silmek istediğinize emin misiniz?")) {
      deleteMutation.mutate();
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (editText.trim() && editText !== comment.text) {
      updateMutation.mutate();
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setEditText(comment.text);
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0 group hover:bg-gray-50 rounded-lg p-3 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <Link
            to={`/profile/${comment.userId}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-gray-800 hover:text-blue-600 transition-colors inline-block"
          >
            {comment.userFirstName} {comment.userLastName}
          </Link>
          <p className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
              <span className="text-gray-400 ml-2">(düzenlendi)</span>
            )}
          </p>
        </div>

        {canEdit && !isEditing && (
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleEditClick}
              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              Düzenle
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isLoading}
              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              {deleteMutation.isLoading ? "Siliniyor..." : "Sil"}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={updateMutation.isLoading}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              {updateMutation.isLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">{comment.text}</p>
      )}
    </div>
  );
};

export default CommentItem;
