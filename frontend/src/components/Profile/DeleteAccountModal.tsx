import React, { useState } from "react";
import { useMutation } from "react-query";
import { userService, DeleteAccountData } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../Common/Button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const { logout } = useAuth();

  const deleteAccountMutation = useMutation(
    (passwordData: DeleteAccountData) =>
      userService.deleteAccount(passwordData),
    {
      onSuccess: () => {
        logout();
        window.location.href = "/";
      },
      onError: (error: any) => {
        setError(
          error.response?.data?.message || "Hesap silinirken hata oluştu"
        );
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Şifre gereklidir");
      return;
    }

    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    deleteAccountMutation.mutate({ password });
  };

  const handleCancel = () => {
    setIsConfirming(false);
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {isConfirming ? "Son Onay" : "Hesabı Sil"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isConfirming ? (
          <>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Dikkat!</p>
              <p>
                Bu işlem geri alınamaz. Tüm şarkılarınız, yorumlarınız ve
                beğenileriniz silinecektir.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Şifrenizi Girin
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hesap şifreniz"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Hesabımı Sil
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  className="flex-1"
                >
                  İptal
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Son Onay</p>
              <p>
                Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri
                alınamaz!
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => deleteAccountMutation.mutate({ password })}
                disabled={deleteAccountMutation.isLoading}
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deleteAccountMutation.isLoading ? "Siliniyor..." : "Evet, Sil"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountModal;
