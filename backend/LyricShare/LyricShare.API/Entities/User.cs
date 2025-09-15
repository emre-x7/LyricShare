using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace LyricShare.API.Entities
{
    public class User : IdentityUser<int>
    {
        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string LastName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<SongLyric> SongLyrics { get; set; } = new List<SongLyric>();
        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
