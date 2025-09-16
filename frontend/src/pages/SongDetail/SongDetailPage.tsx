import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { songService } from "../../services/songService";
import { commentService } from "../../services/commentService";
import CommentSection from "../../components/Comment/CommentSection";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import LikeButton from "../../components/Song/LikeButton";

const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const songId = parseInt(id!);

  const {
    data: song,
    isLoading: songLoading,
    error: songError,
  } = useQuery(["song", songId], () => songService.getSongById(songId));

  const { data: comments, isLoading: commentsLoading } = useQuery(
    ["comments", songId],
    () => commentService.getComments(songId),
    {
      enabled: !!songId,
    }
  );

  if (songLoading) {
    return <LoadingSpinner />;
  }

  if (songError) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Şarkı yüklenirken hata oluştu: {(songError as Error).message}
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          ← Ana sayfaya dön
        </Link>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Şarkı bulunamadı
          </h2>
          <Link to="/" className="text-blue-600 hover:underline">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Ana sayfaya dön
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {song.title}
            </h1>
            <p className="text-gray-600 text-lg">Sanatçı: {song.artist}</p>
          </div>
          <LikeButton
            songId={song.id}
            initialLiked={song.hasLiked}
            likeCount={song.likeCount}
          />
        </div>

        <div className="mb-6">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {song.content}
          </p>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
          <div>
            <Link
              to={`/profile/${song.userId}`}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              {song.authorFirstName} {song.authorLastName}
            </Link>
            <span>
              {" "}
              • {new Date(song.createdAt).toLocaleDateString("tr-TR")}
            </span>
          </div>

          <div className="flex items-center space-x-4">
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
        </div>
      </div>

      <CommentSection
        songId={songId}
        comments={comments || []}
        isLoading={commentsLoading}
      />
    </div>
  );
};

export default SongDetailPage;
