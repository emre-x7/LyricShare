namespace LyricShare.API.Entities
{
    public class Like : BaseEntity
    {
        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;
        public int SongLyricId { get; set; }
        public virtual SongLyric SongLyric { get; set; } = null!;
    }
}
