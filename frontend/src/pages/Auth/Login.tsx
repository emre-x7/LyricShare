import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);

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
      setError(err.response?.data?.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Giriş Yap</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Email adresiniz"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          label="Şifre"
          placeholder="Şifreniz"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      <p className="text-center mt-4">
        Hesabınız yok mu?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
};

export default Login;
