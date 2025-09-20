import React from "react";
import { UserActivity } from "../../services/userService";
import LoadingSpinner from "../Common/LoadingSpinner";

interface UserActivityFeedProps {
  activity: UserActivity | undefined;
  isLoading: boolean;
}

const UserActivityFeed: React.FC<UserActivityFeedProps> = ({
  activity,
  isLoading,
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
      <h2 className="text-xl font-bold text-gray-800 mb-4">Son Aktivite</h2>

      <div className="space-y-4">
        {/* Son Şarkılar */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Son Şarkılar</h3>
          {activity?.recentSongs?.length ? (
            <div className="space-y-2">
              {activity.recentSongs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{song.title}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(song.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Henüz şarkı paylaşılmamış</p>
          )}
        </div>

        {/* Son Yorumlar */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Son Yorumlar</h3>
          {activity?.recentComments?.length ? (
            <div className="space-y-2">
              {activity.recentComments.map((comment) => (
                <div key={comment.id} className="p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-800">{comment.text}</p>
                  <p className="text-xs text-gray-500">
                    {comment.songTitle} •{" "}
                    {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Henüz yorum yapılmamış</p>
          )}
        </div>

        {/* Son Beğeniler */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Son Beğeniler</h3>
          {activity?.recentLikes?.length ? (
            <div className="space-y-2">
              {activity.recentLikes.map((like) => (
                <div
                  key={like.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{like.songTitle}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(like.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Henüz beğeni yapılmamış</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityFeed;
