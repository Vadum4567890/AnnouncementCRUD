using AnnouncementTest.Models;
using Microsoft.AspNetCore.Mvc;

namespace AnnouncementTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly MyDbContext _dbContext;

        public AnnouncementController(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("Announcements")]
        public ActionResult<IEnumerable<Announcement>> GetAnnouncements()
        {
            var announcements = _dbContext.Announcements.ToList();
            if (announcements.Any())
            {
                return Ok(announcements);
            }
            return NotFound();
        }

        // GET: api/Announcement/5
        [HttpGet("{id}")]
        public ActionResult<Announcement> GetAnnouncement(int id)
        {
            var announcement = _dbContext.Announcements.FirstOrDefault(a => a.Id == id);

            if (announcement == null)
                return NotFound();

            return Ok(announcement);
        }

        // POST: api/Announcement
        [HttpPost]
        public ActionResult<Announcement> CreateAnnouncement(Announcement announcement)
        {
            _dbContext.Announcements.Add(announcement);
            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.Id }, announcement);
        }

        // PUT: api/Announcement/5
        [HttpPut("{id}")]
        public IActionResult UpdateAnnouncement(int id, Announcement updatedAnnouncement)
        {
            var announcement = _dbContext.Announcements.FirstOrDefault(a => a.Id == id);

            if (announcement == null)
                return NotFound();

            announcement.Title = updatedAnnouncement.Title;
            announcement.Description = updatedAnnouncement.Description;
            announcement.DateCreated = updatedAnnouncement.DateCreated;

            _dbContext.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Announcement/5
        [HttpDelete("{id}")]
        public IActionResult DeleteAnnouncement(int id)
        {
            var announcement = _dbContext.Announcements.FirstOrDefault(a => a.Id == id);

            if (announcement == null)
                return NotFound();

            _dbContext.Announcements.Remove(announcement);
            _dbContext.SaveChanges();

            return NoContent();
        }

        [HttpGet("{id}/Similar")]
        public ActionResult<IEnumerable<Announcement>> GetSimilarAnnouncements(int id)
        {
            var announcement = _dbContext.Announcements.FirstOrDefault(a => a.Id == id);

            if (announcement == null)
                return NotFound();

            var similarAnnouncements = _dbContext.Announcements
                .Where(a => a.Id != id && (a.Title.Contains(announcement.Title) || a.Description.Contains(announcement.Description)))
                .Take(3)
                .ToList();  

            return Ok(similarAnnouncements);
        }
    }
}
