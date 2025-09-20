using System.ComponentModel.DataAnnotations;

namespace LyricShare.API.Models.ProfileModels
{
    public class UserProfileDto
    {
        public int Id { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        public DateTime? CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new List<string>();

        public class UpdateProfileDto
        {
            [Required, MaxLength(100)]
            public string FirstName { get; set; } = string.Empty;

            [Required, MaxLength(100)]
            public string LastName { get; set; } = string.Empty;

        }

        public class UserSongLyricDto
        {
            public int Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Artist { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
            public int LikeCount { get; set; }
            public int CommentCount { get; set; }
        }

    }
}
