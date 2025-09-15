using LyricShare.API.Entities;
using LyricShare.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LyricShare.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly string _jwtSecret;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<TokenService> _logger;

        public TokenService(
            IOptions<JwtSettings> jwtSettings,
            UserManager<User> userManager,
            IConfiguration configuration,
            ILogger<TokenService> logger)
        {
            _jwtSettings = jwtSettings.Value;
            _userManager = userManager;
            _logger = logger;

            // JWT secret'ı configuration'dan al
            _jwtSecret = configuration["JWT_SECRET"]
                ?? throw new InvalidOperationException("JWT Secret is not configured. Set the JWT_SECRET environment variable.");

            // Secret uzunluğunu kontrol et (en az 32 karakter önerilir)
            if (_jwtSecret.Length < 32)
            {
                _logger.LogWarning("JWT Secret length is less than 32 characters. Consider using a longer secret for better security.");
            }
        }

        public async Task<string> CreateTokenAsync(User user)
        {
            try
            {
                // 1. Token'ın içine gömülecek "claim"leri oluştur
                var claims = await GetUserClaimsAsync(user);

                // 2. JWT imzalama için gerekli güvenlik anahtarını oluştur
                var signingCredentials = GetSigningCredentials();

                // 3. JWT token'ının özelliklerini tanımla
                var tokenOptions = GenerateTokenOptions(claims, signingCredentials);

                // 4. Token'ı oluşturup string olarak döndür
                return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating JWT token for user {UserId}", user.Id);
                throw;
            }
        }

        private async Task<List<Claim>> GetUserClaimsAsync(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
                new Claim("username", user.UserName!) // Kullanıcı adını da ekleyelim
            };

            // Kullanıcının rollerini claim'lere ekle
            var roles = await _userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            return claims;
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            return new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        }

        private JwtSecurityToken GenerateTokenOptions(List<Claim> claims, SigningCredentials signingCredentials)
        {
            return new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.TokenValidityInMinutes),
                signingCredentials: signingCredentials
            );
        }
    }
}