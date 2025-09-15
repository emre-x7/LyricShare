using System.ComponentModel.DataAnnotations;

namespace LyricShare.API.Entities
{
    public class BaseEntity
    {
        [Key]
        public int Id { get; set; } //primary key
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
