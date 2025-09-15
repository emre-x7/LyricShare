using System.ComponentModel.DataAnnotations;

namespace LyricShare.API.Models.CommentModels
{
    public class CreateCommentDto
    {
        [Required]
        public string Text { get; set; } = string.Empty;
    }
}
