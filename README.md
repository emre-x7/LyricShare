# 🎵 LyricShare - Şarkı Sözü Paylaşım Platformu

**LyricShare**, kullanıcıların şarkı sözü paylaşıp birbirlerinin içeriklerini beğenebileceği ve yorum yapabileceği full-stack bir web uygulamasıdır.

##  Özellikler

### 🔐 Kimlik Doğrulama Sistemi
- JWT tabanlı güvenli giriş/kayıt
- Rol bazlı yetkilendirme (Admin/User)
- Şifre hashleme ve güvenlik önlemleri

### 🎵 Şarkı Sözü Yönetimi
- CRUD operasyonları (POST, GET, PUT, DELETE)
- Gerçek zamanlı beğeni ve yorum sistemi
- Kişisel profil sayfası

### 👥 Sosyal Etkileşim
- Beğeni sistemi (Like)
- Yorum yapma ve düzenleme
- Kullanıcı istatistikleri ve aktivite takibi

## 🛠️ Teknoloji Stack'i

### Backend
- **.NET 9** - Web API Framework
- **Entity Framework Core** - ORM
- **PostgreSQL** - Veritabanı
- **JWT** - Kimlik Doğrulama
- **Swagger/OpenAPI** - API Dokümantasyonu

### Frontend (Yakında)
- **React.js 18** - UI Framework
- **Axios** - HTTP Client
- **React Router** - Navigation
- **Context API** - State Management

## 🚀 Kurulum ve Çalıştırma

### Backend Kurulumu
```bash
# Repository'yi klonla
git clone https://github.com/emre-x7/LyricShare.git
cd LyricShare/backend

# Database connection string'i ayarla
# appsettings.json içinde:
# "ConnectionStrings": {
#   "DefaultConnection": "Server=localhost;Port=5432;Database=lyricshare_db;User Id=postgres;Password=your_password;"
# }

# NuGet paketlerini restore et
dotnet restore

# Database migration'ları uygula
dotnet ef database update

# Uygulamayı çalıştır
dotnet run
