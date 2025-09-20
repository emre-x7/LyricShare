namespace LyricShare.API.Models.SongLyricModels
{
    public class SongLyricResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public string AuthorFirstName { get; set; } = string.Empty;
        public string AuthorLastName { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty;

        public int LikeCount { get; set; }
        public int CommentCount { get; set; }
        public bool HasLiked { get; set; }
        public int UserId { get; set; }
    }
}


