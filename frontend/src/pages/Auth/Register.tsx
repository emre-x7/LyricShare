import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";

const Register: React.FC = () => {
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
      const response = await authService.register(formData);

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
      setError(err.response?.data?.message || "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="firstName"
          label="Ad"
          placeholder="Adınız"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <Input
          type="text"
          name="lastName"
          label="Soyad"
          placeholder="Soyadınız"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

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
          placeholder="Şifreniz (min 6 karakter)"
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
          {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
        </Button>
      </form>

      <p className="text-center mt-4">
        Zaten hesabınız var mı?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
};

export default Register;
