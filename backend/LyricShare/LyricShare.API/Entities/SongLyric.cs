using System.ComponentModel.DataAnnotations;

namespace LyricShare.API.Entities
{
    public class SongLyric : BaseEntity
    {
        [Required, MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Artist { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
    }
}
