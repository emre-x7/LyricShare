import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/Home/HomePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SongFormPage from "./pages/SongForm/SongFormPage";
import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import SongDetailPage from "./pages/SongDetail/SongDetailPage";
import ProfileEditPage from "./pages/Profile/ProfileEditPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import "./App.css";
import AuthPages from "./pages/Auth/AuthPages";

// React Query client oluştur
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPages />} />
                <Route path="/register" element={<AuthPages />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/song/:id" element={<SongDetailPage />} />
                <Route path="/song/new" element={<SongFormPage />} />
                <Route path="/song/edit/:id" element={<SongFormPage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}

export default App;
