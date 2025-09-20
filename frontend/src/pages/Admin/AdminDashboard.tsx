import React from "react";
import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { adminService } from "../../services/adminService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StatsCard from "../../components/Admin/StatsCard";
import UsersTable from "../../components/Admin/UsersTable";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Admin kontrolü
  const isAdmin = user?.roles?.includes("Admin");

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery("adminStats", adminService.getSystemStats, {
    enabled: isAdmin,
  });

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery("adminUsers", adminService.getAllUsers, {
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            Bu sayfaya erişim izniniz yok. Sadece yöneticiler erişebilir.
          </div>
        </div>
      </div>
    );
  }

  if (statsLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Yönetici Paneli</h1>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Toplam Kullanıcı"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="blue"
        />
        <StatsCard
          title="Toplam Şarkı"
          value={stats?.totalSongs || 0}
          icon="🎵"
          color="green"
        />
        <StatsCard
          title="Toplam Yorum"
          value={stats?.totalComments || 0}
          icon="💬"
          color="purple"
        />
        <StatsCard
          title="Toplam Beğeni"
          value={stats?.totalLikes || 0}
          icon="❤️"
          color="red"
        />
      </div>

        {/* Kullanıcı Yönetimi */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Kullanıcı Yönetimi
          </h2>
          <UsersTable users={users || []} />
        </div>

        {/* Son Kayıtlar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Son Kayıt Olanlar
          </h2>
          {stats?.recentSignups?.length ? (
            <div className="space-y-2">
              {stats.recentSignups.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="text-sm dark:text-gray-300">
                    {user.firstName} {user.lastName} ({user.email})
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Henüz kayıtlı kullanıcı yok.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
