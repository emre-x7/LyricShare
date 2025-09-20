# 🎵 LyricShare - Şarkı Sözü Paylaşım Platformu

**LyricShare**, kullanıcıların şarkı sözü paylaşıp birbirlerinin içeriklerini beğenebileceği ve yorum yapabileceği full-stack bir web uygulamasıdır.

## Özellikler

### Kimlik Doğrulama Sistemi
- JWT tabanlı güvenli giriş/kayıt
- Rol bazlı yetkilendirme (Admin/User)
- Şifre hashleme ve güvenlik önlemleri

### Şarkı Sözü Yönetimi
- CRUD operasyonları (POST, GET, UPDATE, DELETE)
- Gerçek zamanlı beğeni ve yorum sistemi
- Kişisel profil sayfası ve istatistikler

### Sosyal Etkileşim
- Beğeni sistemi (Like/Unlike)
- Yorum yapma ve düzenleme
- Kullanıcı istatistikleri ve aktivite takibi
- Admin paneli ve kullanıcı yönetimi

### Modern UI/UX
- Responsive tasarım (Mobile-first)
- Dark/Light mode desteği
- Glassmorphism efektleri
- Smooth animasyonlar ve geçişler

## 🛠️ Teknoloji Stack'i

### Backend
- **.NET 9** - Web API Framework
- **Entity Framework Core** - ORM
- **PostgreSQL** - Veri tabanı
- **ASP.NET Identity** - Kullanıcı yönetimi
- **JWT** - Kimlik Doğrulama
- **Swagger/OpenAPI** - API Dokümantasyonu

### Frontend
- **React.js 18** - UI Framework
- **TypeScript** - Type Safety
- **React Query** - Server State Management
- **React Router Dom** - Navigation
- **Context API** - Global State Management
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling Framework

## Kurulum ve Çalıştırma

### Gereksinimler
- .NET 9 SDK
- Node.js (v16+)
- PostgreSQL
- Git

### Backend Kurulumu
```bash
# Repository'yi klonla
git clone https://github.com/emre-x7/LyricShare.git
cd LyricShare

# Backend klasörüne git
cd backend

# Database connection string'i ayarla
# appsettings.json içinde PostgreSQL connection string'ini güncelle:
# "ConnectionStrings": {
#   "DefaultConnection": "Server=localhost;Port=5432;Database=lyricshare_db;User Id=postgres;Password=your_password;"
# }

# NuGet paketlerini restore et
dotnet restore

# Database migration'ları uygula
dotnet ef database update

# Uygulamayı çalıştır
dotnet run

# API şu adreste çalışacak: https://localhost:52472
# Swagger dokümantasyonu: https://localhost:52472/swagger
```

### Frontend Kurulumu
```bash
# Yeni terminal penceresi aç
cd LyricShare/frontend

# Bağımlılıkları yükle
npm install

# Environment variables ayarla (opsiyonel)
# .env.local dosyası oluştur:
# REACT_APP_API_URL=https://localhost:52472

# Development server'ı başlat
npm start

# Uygulama şu adreste çalışacak: http://localhost:3000
```

### Test Hesabı
```bash
Normal Kullanıcı:
Email: user7@user.com
Şifre: User123!
```

### Lyric Share Ön İzleme

<img width="1898" height="918" alt="image" src="https://github.com/user-attachments/assets/ae558bab-8a13-4e27-942a-255500e083cc" />
<img width="1917" height="926" alt="image" src="https://github.com/user-attachments/assets/de81cfea-cd84-43d6-9eac-b98847ce82a0" />
<img width="1898" height="925" alt="image" src="https://github.com/user-attachments/assets/6ce3f9b9-abd2-42da-991a-41a26d73d944" />
<img width="1897" height="918" alt="image" src="https://github.com/user-attachments/assets/78a8734d-62bb-4220-bd4d-74b2666f883b" />
<img width="1895" height="838" alt="image" src="https://github.com/user-attachments/assets/1c218865-b046-4b7f-94ea-fb62c8176ace" />
<img width="1900" height="922" alt="image" src="https://github.com/user-attachments/assets/2399d43b-29ff-45e8-9fe6-14bfdb4e7cd7" />
<img width="1902" height="911" alt="image" src="https://github.com/user-attachments/assets/fe587359-c233-41ec-8b3a-1d6ca568d4cd" />
<img width="1897" height="915" alt="image" src="https://github.com/user-attachments/assets/2867a7a5-1104-4602-9d56-beecdfe64f16" />






