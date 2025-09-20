import React from "react";
import { UserStats } from "../../services/userService";
import LoadingSpinner from "../Common/LoadingSpinner";

interface UserStatsCardProps {
  stats: UserStats | undefined;
  isLoading: boolean;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">İstatistikler</h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Toplam Şarkı</span>
          <span className="font-bold text-blue-600">
            {stats?.totalSongLyrics || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Alınan Beğeni</span>
          <span className="font-bold text-green-600">
            {stats?.totalLikesReceived || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Alınan Yorum</span>
          <span className="font-bold text-purple-600">
            {stats?.totalCommentsReceived || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Yazılan Yorum</span>
          <span className="font-bold text-orange-600">
            {stats?.totalCommentsWritten || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Verilen Beğeni</span>
          <span className="font-bold text-red-600">
            {stats?.totalLikesGiven || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCard;
