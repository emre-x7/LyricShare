using LyricShare.API.Data;
using LyricShare.API.Entities;
using LyricShare.API.Models.ProfileModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // GET: api/profiles/me → Kullanıcının kendi profil bilgilerini getir
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

        // PUT: api/profiles/me → Kullanıcının kendi profil bilgilerini güncelle
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile(UpdateProfileDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                // Bilgileri güncelle
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

        // GET: api/profiles/me/songlyrics → Kullanıcının kendi şarkı sözlerini listele
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

        // GET: api/profiles/me/stats → Kullanıcının istatistiklerini getir
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

        // GET: api/profiles/me/activity → Kullanıcının son aktivitelerini getir
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
    }
}
