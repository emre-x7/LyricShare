import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/userService";
import ChangePasswordModal from "../../components/Profile/ChangePasswordModal";
import DeleteAccountModal from "../../components/Profile/DeleteAccountModal";
import "./../../styles/animations.css";

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updateMutation = useMutation(
    (profileData: { firstName: string; lastName: string }) =>
      userService.updateProfile(profileData),
    {
      onSuccess: () => {
        setSuccessMessage("Profil bilgileriniz başarıyla güncellendi!");
        queryClient.invalidateQueries("userProfile");
        setTimeout(() => navigate("/profile"), 2000);
      },
      onError: (error: any) => {
        setErrors(
          error.response?.data?.errors || {
            general: "Profil güncellenirken hata oluştu",
          }
        );
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Ad gereklidir";
    if (!formData.lastName.trim()) newErrors.lastName = "Soyad gereklidir";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-purple-300/40 text-3xl animate-float-slow">
          👤
        </div>
        <div className="absolute top-40 right-32 text-blue-300/30 text-2xl animate-float-medium">
          ⚙️
        </div>
        <div className="absolute bottom-32 left-1/4 text-indigo-300/40 text-4xl animate-float-slow delay-1000">
          🔒
        </div>
        <div className="absolute bottom-20 right-20 text-purple-300/30 text-2xl animate-float-medium delay-500">
          ✨
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 transition-colors group"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Profile Geri Dön</span>
        </button>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Profilini Düzenle
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kişisel bilgilerini güncelle veya hesap ayarlarını yönet
            </p>
          </div>

          {successMessage && (
            <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6 text-center">
              <span className="font-medium">✅ {successMessage}</span>
            </div>
          )}

          {errors.general && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-center">
              <span className="font-medium">❌ {errors.general}</span>
            </div>
          )}

          {/* Profile Form */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Kişisel Bilgiler
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Adınız *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 dark:text-white ${
                      errors.firstName ? "border-red-300 dark:border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                    placeholder="Adınız"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Soyadınız *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 dark:text-white ${
                      errors.lastName ? "border-red-300 dark:border-red-500" : "border-gray-200 dark:border-gray-600"
                    }`}
                    placeholder="Soyadınız"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {updateMutation.isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Güncelleniyor...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Değişiklikleri Kaydet</span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>

          {/* Account Actions */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Hesap İşlemleri
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-md group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Şifre Değiştir
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Hesap güvenliğinizi güçlendirin
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 hover:shadow-md group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400"
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
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Hesabı Sil</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Hesabınızı kalıcı olarak silin
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ProfileEditPage;
