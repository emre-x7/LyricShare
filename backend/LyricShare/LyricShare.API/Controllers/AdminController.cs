using LyricShare.API.Data;
using LyricShare.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LyricShare.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            ApplicationDbContext context,
            UserManager<User> userManager,
            ILogger<AdminController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        // GET: api/admin/stats → Sistem istatistikleri
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetSystemStats()
        {
            try
            {
                var stats = new
                {
                    TotalUsers = await _userManager.Users.CountAsync(),
                    TotalSongs = await _context.SongLyrics.CountAsync(),
                    TotalComments = await _context.Comments.CountAsync(),
                    TotalLikes = await _context.Likes.CountAsync(),
                    RecentSignups = await _userManager.Users
                        .OrderByDescending(u => u.CreatedAt)
                        .Take(5)
                        .Select(u => new
                        {
                            u.Id,
                            u.FirstName,
                            u.LastName,
                            u.Email,
                            u.CreatedAt
                        })
                        .ToListAsync(),
                    PopularSongs = await _context.SongLyrics
                        .Include(s => s.Likes)
                        .OrderByDescending(s => s.Likes.Count)
                        .Take(5)
                        .Select(s => new
                        {
                            s.Id,
                            s.Title,
                            s.Artist,
                            LikeCount = s.Likes.Count
                        })
                        .ToListAsync()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sistem istatistikleri getirilirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        // GET: api/admin/users → Tüm kullanıcılar
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllUsers()
        {
            try
            {
                var users = new List<object>();

                foreach (var user in await _userManager.Users.OrderBy(u => u.CreatedAt).ToListAsync())
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    var songCount = await _context.SongLyrics.CountAsync(sl => sl.UserId == user.Id);

                    users.Add(new
                    {
                        user.Id,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.CreatedAt,
                        Roles = roles,
                        SongCount = songCount
                    });
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcılar listelenirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        // PUT: api/admin/users/{userId}/roles → Kullanıcı rolünü güncelle
        [HttpPut("users/{userId}/roles")]
        public async Task<ActionResult> UpdateUserRoles(int userId, [FromBody] UpdateRolesDto updateDto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı." });
                }

                // Mevcut rolleri al
                var currentRoles = await _userManager.GetRolesAsync(user);

                // Eski rolleri kaldır
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                {
                    return BadRequest(removeResult.Errors);
                }

                // Yeni rolleri ekle
                var addResult = await _userManager.AddToRolesAsync(user, updateDto.Roles);
                if (!addResult.Succeeded)
                {
                    return BadRequest(addResult.Errors);
                }

                _logger.LogInformation("Kullanıcı rolleri güncellendi: UserId={UserId}, Roles={Roles}",
                    userId, string.Join(",", updateDto.Roles));

                return Ok(new { message = "Kullanıcı rolleri başarıyla güncellendi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı rolleri güncellenirken hata oluştu: UserId={UserId}", userId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        // DELETE: api/admin/songs/{id} → Şarkı sil (admin)
        [HttpDelete("songs/{id}")]
        public async Task<ActionResult> DeleteSong(int id)
        {
            try
            {
                var song = await _context.SongLyrics.FindAsync(id);
                if (song == null)
                {
                    return NotFound(new { message = "Şarkı bulunamadı." });
                }

                _context.SongLyrics.Remove(song);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Şarkı admin tarafından silindi: SongId={SongId}", id);
                return Ok(new { message = "Şarkı başarıyla silindi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şarkı silinirken hata oluştu: SongId={SongId}", id);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        // DELETE: api/admin/comments/{id} → Yorum sil (admin)
        [HttpDelete("comments/{id}")]
        public async Task<ActionResult> DeleteComment(int id)
        {
            try
            {
                var comment = await _context.Comments.FindAsync(id);
                if (comment == null)
                {
                    return NotFound(new { message = "Yorum bulunamadı." });
                }

                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Yorum admin tarafından silindi: CommentId={CommentId}", id);
                return Ok(new { message = "Yorum başarıyla silindi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum silinirken hata oluştu: CommentId={CommentId}", id);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }
    }

    // DTO for role updates
    public class UpdateRolesDto
    {
        public List<string> Roles { get; set; } = new List<string>();
    }
}
