using LyricShare.API.Entities;
using LyricShare.API.Models.AuthModels;
using LyricShare.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LyricShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            ITokenService tokenService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            try
            {
                _logger.LogInformation("=== REGISTER İŞLEMİ BAŞLADI ===");
                _logger.LogInformation("Email: {Email}, FirstName: {FirstName}, LastName: {LastName}",
                    registerDto.Email, registerDto.FirstName, registerDto.LastName);

                // 1. Model validation
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Model validation failed: {Errors}",
                        string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
                    return BadRequest(ModelState);
                }

                // 2. Email kontrolü
                var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("Email zaten kullanılıyor: {Email}", registerDto.Email);
                    return BadRequest(new { message = "Bu email adresi zaten kullanılıyor." });
                }

                // 3. Yeni kullanıcı oluştur
                var user = new User
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    UserName = registerDto.Email // Email'i kullanıcı adı olarak da kullan
                };

                _logger.LogInformation("Yeni kullanıcı nesnesi oluşturuldu: {Email}", user.Email);

                // 4. Kullanıcıyı oluştur ve şifreyi ayarla
                var result = await _userManager.CreateAsync(user, registerDto.Password);

                if (!result.Succeeded)
                {
                    _logger.LogError("Kullanıcı oluşturma BAŞARISIZ: {Errors}",
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                    return BadRequest(result.Errors);
                }

                _logger.LogInformation("Kullanıcı başarıyla oluşturuldu. UserId: {UserId}", user.Id);

                // 5. Kullanıcıya "User" rolünü ata
                var roleResult = await _userManager.AddToRoleAsync(user, "User");
                if (!roleResult.Succeeded)
                {
                    _logger.LogError("Rol atama BAŞARISIZ: {Errors}",
                        string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                    // Rol atanamasa bile kullanıcı oluşturuldu, devam edelim
                }
                else
                {
                    _logger.LogInformation("Kullanıcıya 'User' rolü atandı");
                }

                // 6. Token oluştur ve response döndür
                var token = await _tokenService.CreateTokenAsync(user);

                _logger.LogInformation("Token başarıyla oluşturuldu. Kullanıcı: {Email}", registerDto.Email);

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(60),
                    Message = "Kullanıcı başarıyla kaydedildi."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Register işleminde beklenmeyen hata: {Email}", registerDto.Email);
                return StatusCode(500, new { message = "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user == null)
                {
                    return Unauthorized(new { message = "Email veya şifre hatalı." });
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

                if (!result.Succeeded)
                {
                    return Unauthorized(new { message = "Email veya şifre hatalı." });
                }

                _logger.LogInformation("Kullanıcı giriş yaptı: {Email}", loginDto.Email);

                var token = await _tokenService.CreateTokenAsync(user);

                return Ok(new AuthResponseDto
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(60),
                    Message = "Giriş başarılı."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login işleminde hata oluştu: {Email}", loginDto.Email);
                return StatusCode(500, new { message = "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
            }
        }
    }
}
