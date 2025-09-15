using LyricShare.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LyricShare.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<SongLyric> SongLyrics { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Like> Likes { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Like>()
                .HasKey(l => new { l.UserId, l.SongLyricId });

            modelBuilder.Entity<SongLyric>()
                .HasMany(s => s.Comments)
                .WithOne(c => c.SongLyric)
                .HasForeignKey(c => c.SongLyricId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SongLyric>()
                .HasMany(s => s.Likes)
                .WithOne(l => l.SongLyric)
                .HasForeignKey(l => l.SongLyricId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
