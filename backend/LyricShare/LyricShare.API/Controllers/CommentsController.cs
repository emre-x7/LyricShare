using LyricShare.API.Data;
using LyricShare.API.Entities;
using LyricShare.API.Models.CommentModels;
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
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<CommentsController> _logger;

        public CommentsController(
            ApplicationDbContext context,
            UserManager<User> userManager,
            ILogger<CommentsController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetComments(int songId)
        {
            try
            {
                var comments = await _context.Comments
                    .Include(c => c.User)
                    .Where(c => c.SongLyricId == songId)
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new CommentResponseDto
                    {
                        Id = c.Id,
                        Text = c.Text,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        SongLyricId = c.SongLyricId,
                        UserId = c.UserId,
                        UserFirstName = c.User.FirstName,
                        UserLastName = c.User.LastName,
                        UserEmail = c.User.Email
                    })
                    .ToListAsync();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorumlar listelenirken hata oluştu: {SongId}", songId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpPost]
        public async Task<ActionResult<CommentResponseDto>> CreateComment(int songId, CreateCommentDto createDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var songExists = await _context.SongLyrics.AnyAsync(s => s.Id == songId);
                if (!songExists) return NotFound(new { message = "Şarkı sözü bulunamadı." });

                var comment = new Comment
                {
                    Text = createDto.Text,
                    SongLyricId = songId,
                    UserId = user.Id
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                var responseDto = new CommentResponseDto
                {
                    Id = comment.Id,
                    Text = comment.Text,
                    CreatedAt = comment.CreatedAt,
                    SongLyricId = comment.SongLyricId,
                    UserId = user.Id,
                    UserFirstName = user.FirstName,
                    UserLastName = user.LastName,
                    UserEmail = user.Email
                };

                _logger.LogInformation("Yeni yorum eklendi: UserId={UserId}, SongId={SongId}", user.Id, songId);
                return CreatedAtAction(nameof(GetComments), new { songId = songId }, responseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum eklenirken hata oluştu: {SongId}", songId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpPut("{commentId}")]
        public async Task<IActionResult> UpdateComment(int songId, int commentId, CreateCommentDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var comment = await _context.Comments.FindAsync(commentId);
                if (comment == null) return NotFound();

                if (comment.SongLyricId != songId)
                {
                    return BadRequest(new { message = "Yorum bu şarkıya ait değil." });
                }

                if (comment.UserId != user.Id && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                comment.Text = updateDto.Text;
                comment.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Yorum güncellendi: CommentId={CommentId}, UserId={UserId}", commentId, user.Id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum güncellenirken hata oluştu: {CommentId}", commentId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int songId, int commentId)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null) return Unauthorized();

                var comment = await _context.Comments.FindAsync(commentId);
                if (comment == null) return NotFound();

                if (comment.SongLyricId != songId)
                {
                    return BadRequest(new { message = "Yorum bu şarkıya ait değil." });
                }

                if (comment.UserId != user.Id && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Yorum silindi: CommentId={CommentId}, UserId={UserId}", commentId, user.Id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum silinirken hata oluştu: {CommentId}", commentId);
                return StatusCode(500, new { message = "Sunucu hatası." });
            }
        }
    }
}
