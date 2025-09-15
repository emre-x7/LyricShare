namespace LyricShare.API.Models.LikeModels
{
    public class LikeResponseDto
    {
        public int SongLyricId { get; set; }
        public int UserId { get; set; }
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
        public DateTime LikedAt { get; set; }
    }
}
