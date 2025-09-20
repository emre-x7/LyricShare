import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import "./../../styles/animations.css";

interface AuthFormProps {
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string;
  loading: boolean;
  setCurrentPage: (page: "login" | "register") => void;
}

const LoginForm: React.FC<AuthFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  error,
  loading,
  setCurrentPage,
}) => (
  <div className="w-full max-w-md">
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Tekrar Hoş Geldiniz!
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Müzik yolculuğunuza kaldığınız yerden devam edin
      </p>
    </div>

    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email Adresiniz
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pl-12 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="ornek@email.com"
              required
            />
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Şifreniz
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pl-12 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="••••••••"
              required
            />
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
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
              Giriş yapılıyor...
            </div>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Henüz hesabınız yok mu?{" "}
          <button
            onClick={() => setCurrentPage("register")}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold"
          >
            Kayıt olun
          </button>
        </p>
      </div>
    </div>
  </div>
);

const RegisterForm: React.FC<AuthFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  error,
  loading,
  setCurrentPage,
}) => (
  <div className="w-full max-w-md">
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Müzik Ailesine Katılın!
      </h1>
      <p className="text-gray-600  dark:text-gray-300">
        Şarkı sözlerini paylaşmaya başlamak için hesap oluşturun
      </p>
    </div>

    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Adınız
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Adınız"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Soyadınız
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Soyadınız"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email Adresiniz
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pl-12 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="ornek@email.com"
              required
            />
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Şifreniz
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pl-12 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Minimum 6 karakter"
              required
            />
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="0Color"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 000-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml01 mr-3 h-5 w-5 text-white"
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
              Hesap oluşturuluyor...
            </div>
          ) : (
            "Hesap Oluştur"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Zaten hesabınız var mı?{" "}
          <button
            onClick={() => setCurrentPage("login")}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold"
          >
            Giriş yapın
          </button>
        </p>
      </div>
    </div>
  </div>
);

const AuthPages: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (currentPage === "login") {
        response = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authService.register(formData);
      }

      // Token'ı decode ederek kullanıcı bilgilerini al
      const payload = JSON.parse(atob(response.token.split(".")[1]));
      const userData = {
        id: parseInt(payload.sub),
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        createdAt: payload.createdAt,
        roles: payload.role ? [payload.role] : ["User"],
      };

      login(response.token, userData);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (currentPage === "login" ? "Giriş başarısız" : "Kayıt başarısız")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 dark:bg-purple-800/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-800/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating musical notes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 text-purple-300/40 dark:text-purple-600/30 text-3xl animate-float-slow">
          ♪
        </div>
        <div className="absolute top-40 right-32 text-blue-300/30 dark:text-blue-600/20 text-2xl animate-float-medium">
          ♫
        </div>
        <div className="absolute bottom-32 left-1/4 text-indigo-300/40 dark:text-indigo-600/30 text-4xl animate-float-slow delay-1000">
          ♪
        </div>
        <div className="absolute bottom-20 right-20 text-purple-300/30 dark:text-purple-600/20 text-2xl animate-float-medium delay-500">
          ♬
        </div>
        <div className="absolute top-1/3 left-1/2 text-blue-300/20 dark:text-blue-600/10 text-xl animate-float-slow delay-2000">
          ♩
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {currentPage === "login" ? (
          <LoginForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            error={error}
            loading={loading}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <RegisterForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            error={error}
            loading={loading}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPages;
