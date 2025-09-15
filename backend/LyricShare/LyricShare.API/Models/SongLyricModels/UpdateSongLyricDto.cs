using System.ComponentModel.DataAnnotations;

namespace LyricShare.API.Models.SongLyricModels
{
    public class UpdateSongLyricDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Artist { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;
    }
}
