import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Sayfa yüklendiğinde ve route değiştiğinde scroll'u en üste al
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Sayfa yüklendiğinde scroll pozisyonunu kontrol et
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Sayfa en üstteyken koyu arkaplan için özel stil
  const isAtTop = !isScrolled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border-b border-purple-100 dark:border-gray-700"
            : "bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-indigo-700/90 dark:from-gray-800/90 dark:via-gray-700/90 dark:to-gray-800/90 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-purple-500 to-blue-500"
                    : "bg-white/20"
                }`}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <h1
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? "text-gray-800 dark:text-white" : "text-white"
                }`}
              >
                LyricShare
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
                    : "text-white hover:bg-white/20"
                }`}
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/song/new"
                    className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isScrolled
                        ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Yeni Şarkı
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isScrolled
                        ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Profilim
                  </Link>

                  {/* User Avatar & Dropdown */}
                  <div className="relative group">
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                        isScrolled
                          ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 text-purple-700 dark:text-gray-300"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </div>
                      <span className="font-medium">{user?.firstName}</span>
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-purple-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          Profili Görüntüle
                        </Link>
                        <Link
                          to="/profile/edit"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          Profili Düzenle
                        </Link>
                        <hr className="my-2 border-purple-100 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isScrolled
                        ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isScrolled
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl"
                        : "bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 shadow-md hover:shadow-lg font-semibold"
                    }`}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } ${
            isScrolled
              ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-purple-100 dark:border-gray-700"
              : "bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-indigo-700/95 dark:from-gray-800/95 dark:via-gray-700/95 dark:to-gray-800/95 backdrop-blur-md border-t border-purple-400/30 dark:border-gray-600/30"
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Dark Mode Toggle */}
            <div className={`flex items-center justify-between pb-4 border-b ${
              isScrolled 
                ? "border-purple-100 dark:border-gray-700" 
                : "border-purple-400/30 dark:border-gray-600/30"
            }`}>
              <span
                className={`text-sm font-medium ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300"
                    : "text-white"
                }`}
              >
                Tema
              </span>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {isDarkMode ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {isAuthenticated ? (
              <>
                <div className={`flex items-center space-x-3 pb-4 border-b ${
                  isScrolled 
                    ? "border-purple-100 dark:border-gray-700" 
                    : "border-purple-400/30 dark:border-gray-600/30"
                }`}>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                        isScrolled
                          ? "text-gray-800 dark:text-white"
                          : "text-white"
                      }`}
                    >
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p
                      className={`text-sm ${
                        isScrolled
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-purple-100"
                      }`}
                    >
                      Hoş geldiniz
                    </p>
                  </div>
                </div>
                <Link
                  to="/song/new"
                  className={`block py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                      : "text-white hover:bg-white/20 hover:text-purple-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Yeni Şarkı
                </Link>
                <Link
                  to="/profile"
                  className={`block py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                      : "text-white hover:bg-white/20 hover:text-purple-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profilim
                </Link>
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isScrolled
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
                      : "text-red-200 hover:bg-red-500/20 hover:text-red-100"
                  }`}
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                      : "text-white hover:bg-white/20 hover:text-purple-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className={`block py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isScrolled
                      ? "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                      : "text-white hover:bg-white/20 hover:text-purple-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">LyricShare</h3>
            <p className="text-purple-200 dark:text-gray-300 mb-6">
              Kalbin dilini paylaş, melodilerin ruhunu keşfet
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="mailto: eemre.ozarslan@gmail.com"
                className="text-purple-200 dark:text-gray-300 hover:text-white transition-colors"
              >
                İletişim
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-purple-700 dark:border-gray-700">
              <p className="text-purple-300 dark:text-gray-400 text-sm">
                © 2025 LyricShare. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
