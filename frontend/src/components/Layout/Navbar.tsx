import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          LyricShare
        </Link>

        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <span>Merhaba, {user?.firstName}</span>
              <Link to="/profile" className="hover:text-blue-200">
                Profil
              </Link>
              <button onClick={handleLogout} className="hover:text-blue-200">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Giriş Yap
              </Link>
              <Link to="/register" className="hover:text-blue-200">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
