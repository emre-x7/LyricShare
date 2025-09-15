using LyricShare.API.Entities;

namespace LyricShare.API.Services
{
    /// <summary>
    /// JWT token oluşturma işlemleri için servis arayüzü
    /// </summary>
    public interface ITokenService
    {
        /// <summary>
        /// Kullanıcı bilgilerine göre JWT token oluşturur
        /// </summary>
        /// <param name="user">Token oluşturulacak kullanıcı</param>
        /// <returns>Oluşturulan JWT token string'i</returns>
        Task<string> CreateTokenAsync(User user);
    }
}