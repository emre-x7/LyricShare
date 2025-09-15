using LyricShare.API.Data;
using LyricShare.API.Entities;
using LyricShare.API.Models.LikeModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LyricShare.API.Controllers
{
    [ApiController]
    [Route("api/songlyrics/{songId}/[controller]")]
    [Authorize]
    public class LikesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<LikesController> _logger;

        public LikesController(
            ApplicationDbContext context,
            UserManager<User> userManager,
            ILogger<LikesController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<LikeResponseDto>>> GetLikes(int songId)
        {
            try
            {
                var likes = await _context.Likes
                    .Include(l => l.User)
                    .Where(l => l.SongLyricId == songId)
                    .OrderByDescending(l => l.CreatedAt)
                    .Select(l => new LikeResponseDto
                    {
                        SongLyricId = l.SongLyricId,
                        UserId = l.UserId,
                        UserFirstName = l.User.FirstName,
                        UserLastName = l.User.LastName,
                        LikedAt = l.CreatedAt
                    })
                    .ToListAsync();

                return Ok(likes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Beğeniler listelenirken hata oluştu: {SongId}", songId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("count")]
        [AllowAnonymous]
        public async Task<ActionResult<int>> GetLikesCount(int songId)
        {
            try
            {
                var count = await _context.Likes
                    .Where(l => l.SongLyricId == songId)
                    .CountAsync();

                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Beğeni sayısı alınırken hata oluştu: {SongId}", songId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ToggleLike(int songId)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var songExists = await _context.SongLyrics.AnyAsync(s => s.Id == songId);
                if (!songExists) return NotFound(new { message = "Şarkı sözü bulunamadı." });

                var existingLike = await _context.Likes
                    .FirstOrDefaultAsync(l => l.SongLyricId == songId && l.UserId == user.Id);

                if (existingLike != null)
                {
                    _context.Likes.Remove(existingLike);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Beğeni kaldırıldı: UserId={UserId}, SongId={SongId}", user.Id, songId);
                    return Ok(new { message = "Beğeni kaldırıldı.", liked = false });
                }
                else
                {
                    var like = new Like
                    {
                        SongLyricId = songId,
                        UserId = user.Id
                    };

                    _context.Likes.Add(like);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Beğeni eklendi: UserId={UserId}, SongId={SongId}", user.Id, songId);
                    return Ok(new { message = "Beğeni eklendi.", liked = true });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Beğeni işlemi sırasında hata oluştu: {SongId}", songId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpGet("check")]
        public async Task<ActionResult<bool>> CheckUserLike(int songId)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var hasLiked = await _context.Likes
                    .AnyAsync(l => l.SongLyricId == songId && l.UserId == user.Id);

                return Ok(hasLiked);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Beğeni kontrolü sırasında hata oluştu: {SongId}", songId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }
    }
}
