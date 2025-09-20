import React, { useState } from "react";
import { useMutation } from "react-query";
import { userService, ChangePasswordData } from "../../services/userService";
import Button from "../Common/Button";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const changePasswordMutation = useMutation(
    (passwordData: ChangePasswordData) =>
      userService.changePassword(passwordData),
    {
      onSuccess: () => {
        setSuccessMessage("Şifre başarıyla değiştirildi!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 2000);
      },
      onError: (error: any) => {
        setErrors({
          general:
            error.response?.data?.message ||
            "Şifre değiştirilirken hata oluştu",
        });
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
    setErrors({});

    // Validasyon
    const newErrors: { [key: string]: string } = {};
    if (!formData.currentPassword)
      newErrors.currentPassword = "Mevcut şifre gereklidir";
    if (!formData.newPassword) newErrors.newPassword = "Yeni şifre gereklidir";
    if (formData.newPassword.length < 6)
      newErrors.newPassword = "Şifre en az 6 karakter olmalıdır";
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Şifre Değiştir</h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mevcut Şifre
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.currentPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Yeni Şifre
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={changePasswordMutation.isLoading}
              variant="primary"
              className="flex-1"
            >
              {changePasswordMutation.isLoading
                ? "Değiştiriliyor..."
                : "Şifreyi Değiştir"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              İptal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
