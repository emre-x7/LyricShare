using LyricShare.API.Data;
using LyricShare.API.Entities;
using LyricShare.API.Models.SongLyricModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LyricShare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SongLyricsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<SongLyricsController> _logger;

        public SongLyricsController(
            ApplicationDbContext context,
            UserManager<User> userManager,
            ILogger<SongLyricsController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<SongLyricResponseDto>>> GetSongLyrics()
        {
            try
            {
                var userId = GetCurrentUserId();

                var songLyrics = await _context.SongLyrics
                    .Include(sl => sl.User)
                    .Include(sl => sl.Likes)
                    .Include(sl => sl.Comments)
                    .OrderByDescending(sl => sl.CreatedAt)
                    .Select(sl => new SongLyricResponseDto
                    {
                        Id = sl.Id,
                        Title = sl.Title,
                        Artist = sl.Artist,
                        Content = sl.Content,
                        CreatedAt = sl.CreatedAt,
                        UpdatedAt = sl.UpdatedAt,
                        AuthorFirstName = sl.User.FirstName,
                        AuthorLastName = sl.User.LastName,
                        AuthorEmail = sl.User.Email,
                        LikeCount = sl.Likes.Count,
                        CommentCount = sl.Comments.Count,
                        HasLiked = userId.HasValue ? sl.Likes.Any(l => l.UserId == userId.Value) : false,
                        UserId = sl.UserId
                    })
                    .ToListAsync();

                return Ok(songLyrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şarkı sözleri listelenirken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<SongLyricResponseDto>> GetSongLyric(int id)
        {
            try
            {
                var userId = GetCurrentUserId();

                var songLyric = await _context.SongLyrics
                    .Include(sl => sl.User)
                    .Include(sl => sl.Likes)
                    .Include(sl => sl.Comments)
                    .Where(sl => sl.Id == id)
                    .Select(sl => new SongLyricResponseDto
                    {
                        Id = sl.Id,
                        Title = sl.Title,
                        Artist = sl.Artist,
                        Content = sl.Content,
                        CreatedAt = sl.CreatedAt,
                        UpdatedAt = sl.UpdatedAt,
                        AuthorFirstName = sl.User.FirstName,
                        AuthorLastName = sl.User.LastName,
                        AuthorEmail = sl.User.Email,
                        LikeCount = sl.Likes.Count,
                        CommentCount = sl.Comments.Count,
                        HasLiked = userId.HasValue ? sl.Likes.Any(l => l.UserId == userId.Value) : false,
                        UserId = sl.UserId

                    })
                    .FirstOrDefaultAsync();

                if (songLyric == null)
                {
                    return NotFound(new { message = "Şarkı sözü bulunamadı." });
                }

                return Ok(songLyric);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şarkı sözü getirilirken hata oluştu: {Id}", id);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        private int? GetCurrentUserId()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                {
                    return userId;
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult<SongLyricResponseDto>> CreateSongLyric(CreateSongLyricDto createDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                // DEBUG: Kullanıcı bilgilerini logla
                _logger.LogInformation("Kullanıcı bilgileri: UserId={UserId}, Email={Email}", user.Id, user.Email);

                var songLyric = new SongLyric
                {
                    Title = createDto.Title,
                    Artist = createDto.Artist,
                    Content = createDto.Content,
                    UserId = user.Id // Mevcut kullanıcının ID'si
                };

                _context.SongLyrics.Add(songLyric);
                await _context.SaveChangesAsync();

                // DEBUG: Oluşturulan şarkıyı logla
                _logger.LogInformation("Şarkı oluşturuldu: Id={SongId}, UserId={SongUserId}",
                    songLyric.Id, songLyric.UserId);

                // Response için mevcut kullanıcı bilgilerini kullan
                var responseDto = new SongLyricResponseDto
                {
                    Id = songLyric.Id,
                    Title = songLyric.Title,
                    Artist = songLyric.Artist,
                    Content = songLyric.Content,
                    CreatedAt = songLyric.CreatedAt,
                    AuthorFirstName = user.FirstName,
                    AuthorLastName = user.LastName,
                    AuthorEmail = user.Email,
                    LikeCount = 0,
                    CommentCount = 0
                };

                return CreatedAtAction(nameof(GetSongLyric), new { id = songLyric.Id }, responseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şarkı sözü oluşturulurken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSongLyric(int id, UpdateSongLyricDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized();

                var songLyric = await _context.SongLyrics.FindAsync(id);
                if (songLyric == null)
                    return NotFound();

                // DEBUG: Loglama
                _logger.LogInformation("Kullanıcı ID: {UserId}, Şarkı UserID: {SongUserId}", user.Id, songLyric.UserId);
                _logger.LogInformation("Kullanıcı Admin mi: {IsAdmin}", User.IsInRole("Admin"));

                if (songLyric.UserId != user.Id && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                songLyric.Title = updateDto.Title;
                songLyric.Artist = updateDto.Artist;
                songLyric.Content = updateDto.Content;
                songLyric.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şarkı sözü güncellenirken hata oluştu: {Id}", id);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSongLyric(int id)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized();

                var songLyric = await _context.SongLyrics.FindAsync(id);
                if (songLyric == null)
                    return NotFound();

                // DEBUG: Loglama
                _logger.LogInformation("Kullanıcı ID: {UserId}, Şarkı UserID: {SongUserId}", user.Id, songLyric.UserId);
                _logger.LogInformation("Kullanıcı Admin mi: {IsAdmin}", User.IsInRole("Admin"));

                if (songLyric.UserId != user.Id && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                _context.SongLyrics.Remove(songLyric);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şarkı sözü silinirken hata oluştu: {Id}", id);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }
    }
}