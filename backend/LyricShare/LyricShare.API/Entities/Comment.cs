using System.ComponentModel.DataAnnotations;

namespace LyricShare.API.Entities
{
    public class Comment : BaseEntity
    {
        [Required]
        public string Text { get; set; } = string.Empty;

        public int SongLyricId { get; set; }
        public virtual SongLyric SongLyric { get; set; } = null!;
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
