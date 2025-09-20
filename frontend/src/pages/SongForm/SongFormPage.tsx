import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  songService,
  CreateSongData,
  UpdateSongData,
} from "../../services/songService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const SongFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  const songId = id ? parseInt(id) : undefined;

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    content: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Tasarım kodundan eklenen yeni state
  const [charCount, setCharCount] = useState(0);

  // Düzenleme modunda şarkıyı getir
  const { data: existingSong, isLoading: isLoadingSong } = useQuery(
    ["song", songId],
    () => songService.getSongById(songId!),
    {
      enabled: isEditMode && !!songId,
      onSuccess: (data) => {
        setFormData({
          title: data.title,
          artist: data.artist,
          content: data.content,
        });
        setCharCount(data.content.length);
      },
    }
  );

  // Şarkı oluşturma mutation'ı
  const createMutation = useMutation(
    (songData: CreateSongData) => songService.createSong(songData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("songs");
        navigate("/profile");
      },
      onError: (error: any) => {
        setErrors(
          error.response?.data?.errors || {
            general: "Şarkı oluşturulurken hata oluştu",
          }
        );
      },
    }
  );

  // Şarkı güncelleme mutation'ı
  const updateMutation = useMutation(
    (songData: UpdateSongData) => songService.updateSong(songId!, songData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("songs");
        queryClient.invalidateQueries(["song", songId]);
        navigate("/profile");
      },
      onError: (error: any) => {
        setErrors(
          error.response?.data?.errors || {
            general: "Şarkı güncellenirken hata oluştu",
          }
        );
      },
    }
  );

  const isLoading =
    isLoadingSong || createMutation.isLoading || updateMutation.isLoading;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Tasarım kodundan: Karakter sayacını güncelle
    if (name === "content") {
      setCharCount(value.length);
    }

    // Hata mesajını temizle
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasyon
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Başlık gereklidir";
    if (!formData.artist.trim()) newErrors.artist = "Sanatçı gereklidir";
    if (!formData.content.trim()) newErrors.content = "Şarkı sözü gereklidir";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  // Tasarım kodundan: Şarkı sözlerini formatlamak için fonksiyon
  const formatLyrics = (text: string) => {
    return text.split("\n").map((line, index) => (
      <div key={index} className="mb-2">
        {line.trim() === "" ? (
          <div className="h-4"></div>
        ) : (
          <div className="flex">
            <span className="w-8 text-xs text-gray-400 mt-1 flex-shrink-0">
              {line.trim() !== "" ? index + 1 : ""}
            </span>
            <span className="text-gray-700 leading-relaxed italic">{line}</span>
          </div>
        )}
      </div>
    ));
  };

  if (isLoadingSong) {
    return <LoadingSpinner />;
  }

  // Tasarım kodunun JSX yapısı buraya entegre ediliyor
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button - navigate(-1) ile çalışacak şekilde güncellendi */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-8 transition-colors group"
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
          <span className="font-medium">Geri dön</span>
        </button>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            {isEditMode ? "Şarkıyı Düzenle" : "Yeni Şarkı Oluştur"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kalbindeki melodileri sözlere dökme zamanı. Duygularını paylaş,
            müzikseverlere ulaş.
          </p>
        </div>

        {/* Genel Hata Mesajı - Tasarım kodunda yoktu, 1. koddan entegre edildi */}
        {errors.general && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6 text-center">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Şarkı Bilgileri
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Şarkının temel bilgilerini girin
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Şarkı Başlığı *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg dark:text-white ${
                    errors.title
                      ? "border-red-300 dark:border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder="Şarkının başlığını yazın..."
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Artist */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Sanatçı *
                </label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg dark:text-white ${
                    errors.artist
                      ? "border-red-300 dark:border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder="Sanatçı adını yazın..."
                />
                {errors.artist && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {errors.artist}
                  </p>
                )}
              </div>

              {/* Lyrics */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Şarkı Sözleri *
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {charCount.toLocaleString()} karakter
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={12}
                    className={`w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg leading-relaxed resize-none dark:text-white ${
                      errors.content
                        ? "border-red-300 dark:border-red-500"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                    placeholder="Kalbindeki sözleri buraya yaz...

Her satır ayrı bir mısra
Her boş satır bir nefes arası

Duygularına odaklan
Müziğin akışını hisset..."
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full">
                    💡 Her mısra ayrı satırda olsun
                  </div>
                </div>
                {errors.content && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {errors.content}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                      {isEditMode ? "Güncelleniyor..." : "Oluşturuluyor..."}
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
                      <span>
                        {isEditMode
                          ? "Değişiklikleri Kaydet"
                          : "Şarkıyı Yayınla"}
                      </span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50 sticky top-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Önizleme
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Şarkının nasıl görüneceğini buradan kontrol edin
              </p>
            </div>

            <div className="space-y-6">
              {/* Preview Card */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {formData.title || "Şarkı Başlığı"}
                </h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium text-lg mb-4">
                  {formData.artist || "Sanatçı Adı"}
                </p>

                <div className="bg-white/70 dark:bg-gray-700/70 rounded-xl p-4 max-h-64 overflow-y-auto">
                  {formData.content ? (
                    <div className="font-mono text-sm dark:text-gray-300">
                      {formatLyrics(formData.content)}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                      Şarkı sözleri buraya yazıldıkça önizleme görünecek...
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-700">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  İpuçları
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">
                      •
                    </span>
                    <span>Her mısra ayrı satırda yazılmalı</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">
                      •
                    </span>
                    <span>Kıtalar arasında boş satır bırakın</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">
                      •
                    </span>
                    <span>Açık ve anlaşılır bir dil kullanın</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">
                      •
                    </span>
                    <span>Duygularınızı samimi şekilde ifade edin</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongFormPage;
