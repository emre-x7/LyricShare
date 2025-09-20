using LyricShare.API.Data;
using LyricShare.API.Entities;
using LyricShare.API.Models.ProfileModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static LyricShare.API.Models.ProfileModels.UserProfileDto;

namespace LyricShare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfilesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<ProfilesController> _logger;

        public ProfilesController(
            ApplicationDbContext context,
            UserManager<User> userManager,
            ILogger<ProfilesController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetMyProfile()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var roles = await _userManager.GetRolesAsync(user);

                var profileDto = new UserProfileDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    CreatedAt = user.CreatedAt,
                    Roles = roles.ToList()
                };

                return Ok(profileDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Profil bilgileri getirilirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile(UpdateProfileDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                user.FirstName = updateDto.FirstName;
                user.LastName = updateDto.LastName;
                user.UpdatedAt = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    _logger.LogError("Profil güncellenirken hata: {Errors}",
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                    return BadRequest(result.Errors);
                }

                _logger.LogInformation("Profil güncellendi: UserId={UserId}", user.Id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Profil güncellenirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("me/songlyrics")]
        public async Task<ActionResult<IEnumerable<UserSongLyricDto>>> GetMySongLyrics()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var songLyrics = await _context.SongLyrics
                    .Include(sl => sl.Likes)
                    .Include(sl => sl.Comments)
                    .Where(sl => sl.UserId == user.Id)
                    .OrderByDescending(sl => sl.CreatedAt)
                    .Select(sl => new UserSongLyricDto
                    {
                        Id = sl.Id,
                        Title = sl.Title,
                        Artist = sl.Artist,
                        CreatedAt = sl.CreatedAt,
                        LikeCount = sl.Likes.Count,
                        CommentCount = sl.Comments.Count
                    })
                    .ToListAsync();

                return Ok(songLyrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı şarkı sözleri listelenirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("me/stats")]
        public async Task<ActionResult<object>> GetMyStats()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var stats = new
                {
                    TotalSongLyrics = await _context.SongLyrics
                        .Where(sl => sl.UserId == user.Id)
                        .CountAsync(),

                    TotalLikesReceived = await _context.Likes
                        .Where(l => _context.SongLyrics
                            .Where(sl => sl.UserId == user.Id)
                            .Select(sl => sl.Id)
                            .Contains(l.SongLyricId))
                        .CountAsync(),

                    TotalCommentsReceived = await _context.Comments
                        .Where(c => _context.SongLyrics
                            .Where(sl => sl.UserId == user.Id)
                            .Select(sl => sl.Id)
                            .Contains(c.SongLyricId))
                        .CountAsync(),

                    TotalCommentsWritten = await _context.Comments
                        .Where(c => c.UserId == user.Id)
                        .CountAsync(),

                    TotalLikesGiven = await _context.Likes
                        .Where(l => l.UserId == user.Id)
                        .CountAsync()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı istatistikleri getirilirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("me/activity")]
        public async Task<ActionResult<object>> GetMyActivity()
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var recentSongs = await _context.SongLyrics
                    .Where(sl => sl.UserId == user.Id)
                    .OrderByDescending(sl => sl.CreatedAt)
                    .Take(5)
                    .Select(sl => new { sl.Id, sl.Title, sl.CreatedAt })
                    .ToListAsync();

                var recentComments = await _context.Comments
                    .Include(c => c.SongLyric)
                    .Where(c => c.UserId == user.Id)
                    .OrderByDescending(c => c.CreatedAt)
                    .Take(5)
                    .Select(c => new { c.Id, c.Text, c.CreatedAt, SongTitle = c.SongLyric.Title })
                    .ToListAsync();

                var recentLikes = await _context.Likes
                    .Include(l => l.SongLyric)
                    .Where(l => l.UserId == user.Id)
                    .OrderByDescending(l => l.CreatedAt)
                    .Take(5)
                    .Select(l => new { l.Id, l.CreatedAt, SongTitle = l.SongLyric.Title })
                    .ToListAsync();

                return Ok(new
                {
                    RecentSongs = recentSongs,
                    RecentComments = recentComments,
                    RecentLikes = recentLikes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı aktiviteleri getirilirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        // PUT: api/profiles/me/changepassword → Şifre değiştirme
        [HttpPut("me/changepassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized();
                }

                // Mevcut şifreyi kontrol et
                var result = await _userManager.ChangePasswordAsync(
                    user,
                    changePasswordDto.CurrentPassword,
                    changePasswordDto.NewPassword
                );

                if (!result.Succeeded)
                {
                    _logger.LogWarning("Şifre değiştirme başarısız: {Errors}",
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                    return BadRequest(new { message = "Mevcut şifre hatalı." });
                }

                _logger.LogInformation("Şifre başarıyla değiştirildi: UserId={UserId}", user.Id);
                return Ok(new { message = "Şifre başarıyla değiştirildi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şifre değiştirilirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        // DELETE: api/profiles/me → Hesabı silme
        [HttpDelete("me")]
        public async Task<ActionResult> DeleteAccount(DeleteAccountDto deleteAccountDto)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized();
                }

                // Şifreyi kontrol et
                var passwordValid = await _userManager.CheckPasswordAsync(user, deleteAccountDto.Password);
                if (!passwordValid)
                {
                    return BadRequest(new { message = "Şifre hatalı." });
                }

                // Kullanıcıyı sil
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    _logger.LogError("Hesap silme başarısız: {Errors}",
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                    return BadRequest(new { message = "Hesap silinirken hata oluştu." });
                }

                _logger.LogInformation("Hesap silindi: UserId={UserId}, Email={Email}", user.Id, user.Email);
                return Ok(new { message = "Hesabınız başarıyla silindi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Hesap silinirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserProfileDto>> GetUserProfile(int userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı." });
                }

                var roles = await _userManager.GetRolesAsync(user);

                var profileDto = new UserProfileDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    CreatedAt = user.CreatedAt,
                    Roles = roles.ToList()
                };

                return Ok(profileDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı profili getirilirken hata oluştu: {UserId}", userId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("{userId}/stats")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetUserStats(int userId)
        {
            try
            {
                var userExists = await _userManager.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı." });
                }

                var stats = new
                {
                    TotalSongLyrics = await _context.SongLyrics
                        .Where(sl => sl.UserId == userId)
                        .CountAsync(),

                    TotalLikesReceived = await _context.Likes
                        .Where(l => _context.SongLyrics
                            .Where(sl => sl.UserId == userId)
                            .Select(sl => sl.Id)
                            .Contains(l.SongLyricId))
                        .CountAsync(),

                    TotalCommentsReceived = await _context.Comments
                        .Where(c => _context.SongLyrics
                            .Where(sl => sl.UserId == userId)
                            .Select(sl => sl.Id)
                            .Contains(c.SongLyricId))
                        .CountAsync(),

                    TotalCommentsWritten = await _context.Comments
                        .Where(c => c.UserId == userId)
                        .CountAsync(),

                    TotalLikesGiven = await _context.Likes
                        .Where(l => l.UserId == userId)
                        .CountAsync()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı istatistikleri getirilirken hata oluştu: {UserId}", userId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("{userId}/songlyrics")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<UserSongLyricDto>>> GetUserSongLyrics(int userId)
        {
            try
            {
                var userExists = await _userManager.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı." });
                }

                var songLyrics = await _context.SongLyrics
                    .Include(sl => sl.Likes)
                    .Include(sl => sl.Comments)
                    .Where(sl => sl.UserId == userId)
                    .OrderByDescending(sl => sl.CreatedAt)
                    .Select(sl => new UserSongLyricDto
                    {
                        Id = sl.Id,
                        Title = sl.Title,
                        Artist = sl.Artist,
                        CreatedAt = sl.CreatedAt,
                        LikeCount = sl.Likes.Count,
                        CommentCount = sl.Comments.Count
                    })
                    .ToListAsync();

                return Ok(songLyrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı şarkı sözleri listelenirken hata oluştu: {UserId}", userId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("{userId}/activity")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetUserActivity(int userId)
        {
            try
            {
                var userExists = await _userManager.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı." });
                }

                var recentSongs = await _context.SongLyrics
                    .Where(sl => sl.UserId == userId)
                    .OrderByDescending(sl => sl.CreatedAt)
                    .Take(5)
                    .Select(sl => new { sl.Id, sl.Title, sl.CreatedAt })
                    .ToListAsync();

                var recentComments = await _context.Comments
                    .Include(c => c.SongLyric)
                    .Where(c => c.UserId == userId)
                    .OrderByDescending(c => c.CreatedAt)
                    .Take(5)
                    .Select(c => new { c.Id, c.Text, c.CreatedAt, SongTitle = c.SongLyric.Title })
                    .ToListAsync();

                var recentLikes = await _context.Likes
                    .Include(l => l.SongLyric)
                    .Where(l => l.UserId == userId)
                    .OrderByDescending(l => l.CreatedAt)
                    .Take(5)
                    .Select(l => new { l.Id, l.CreatedAt, SongTitle = l.SongLyric.Title })
                    .ToListAsync();

                return Ok(new
                {
                    RecentSongs = recentSongs,
                    RecentComments = recentComments,
                    RecentLikes = recentLikes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı aktiviteleri getirilirken hata oluştu: {UserId}", userId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }
    }
}
