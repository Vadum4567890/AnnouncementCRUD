using Microsoft.EntityFrameworkCore;

namespace AnnouncementTest.Models
{
    public class MyDbContext : DbContext
    {
        public DbSet<Announcement> Announcements { get; set; }
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }
    }
}
