import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser } = useAuth();

  const isOwnProfile = !userId || userId === currentUser?.id?.toString();
  const profileUserId = userId ? parseInt(userId) : currentUser?.id;

  // TODO: API'den kullanıcı bilgilerini çek
  // const { data: profileUser, isLoading } = useQuery(...)

  if (!profileUserId) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Profil bulunamadı
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {isOwnProfile ? "Profilim" : "Kullanıcı Profili"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-gray-600">
                {currentUser?.firstName?.[0]}
                {currentUser?.lastName?.[0]}
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Kişisel Bilgiler
                </h3>
                <p className="text-gray-600">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  İstatistikler
                </h3>
                <p className="text-gray-600">Toplam Şarkı: 0</p>
                <p className="text-gray-600">Toplam Beğeni: 0</p>
                <p className="text-gray-600">Toplam Yorum: 0</p>
              </div>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/profile/edit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Profili Düzenle
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
