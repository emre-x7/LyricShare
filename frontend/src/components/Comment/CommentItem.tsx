import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { commentService } from "../../services/commentService";
import { useAuth } from "../../contexts/AuthContext";

interface CommentItemProps {
  comment: any;
  songId: number;
  styled?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  songId,
  styled = false,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isOwner = user?.id === comment.userId;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

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

  // Yeni tasarım için
  if (styled) {
    return (
      <div className="group hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 rounded-xl p-4 transition-all duration-300 relative">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {comment.userFirstName?.[0]}
              {comment.userLastName?.[0]}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Link
                to={`/profile/${comment.userId}`}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-gray-800 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors"
              >
                {comment.userFirstName} {comment.userLastName}
              </Link>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
              </span>
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="text-xs text-gray-400 ml-2">(düzenlendi)</span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full bg-white dark:bg-gray-700 border border-purple-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={updateMutation.isLoading}
                    className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                  >
                    {updateMutation.isLoading ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {comment.text}
              </p>
            )}
          </div>
        </div>

        {/* Düzenleme/Silme butonları - Yeni tasarım */}
        {isOwner && !isEditing && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <button
                onClick={handleEditClick}
                className="p-1 text-gray-500 hover:text-purple-600 transition-colors"
                title="Düzenle"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Sil"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Orijinal tasarım
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
