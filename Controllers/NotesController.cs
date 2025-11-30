using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Account_Test.Models;
using Account_Test.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace Account_Test.Controllers
{
    [Authorize]
    public class NotesController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public NotesController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Notes
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var notes = _context.Notes
                .Include(n => n.User)
                .Where(n => n.UserId == user.Id);
            return View(await notes.ToListAsync());
        }

        // GET: Notes/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null) return NotFound();

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var note = await _context.Notes
                .Include(n => n.User)
                .FirstOrDefaultAsync(m => m.NoteId == id && m.UserId == user.Id);

            if (note == null) return NotFound();

            return View(note);
        }

        // GET: Notes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Notes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Title,ContentMarkdown,CreatedAt,UpdatedAt,Category")] Note note)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Challenge();
            }

            note.UserId = user.Id;
            // Remove UserId and User from ModelState as we set them manually
            ModelState.Remove("UserId");
            ModelState.Remove("User");

            if (ModelState.IsValid)
            {
                note.NoteId = Guid.NewGuid();
                note.CreatedAt = DateTime.Now;
                note.UpdatedAt = DateTime.Now;
                _context.Add(note);
                await _context.SaveChangesAsync();
                
                // Return JSON for AJAX requests
                if (Request.Headers["X-Requested-With"] == "XMLHttpRequest" || Request.Headers.Accept.ToString().Contains("application/json"))
                {
                    return Json(new { success = true, id = note.NoteId });
                }

                return RedirectToAction(nameof(Index));
            }
            
            if (Request.Headers["X-Requested-With"] == "XMLHttpRequest" || Request.Headers.Accept.ToString().Contains("application/json"))
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return Json(new { success = false, errors = errors });
            }

            if (!ModelState.IsValid)
            {
                return Content(string.Join("\n",
                    ModelState.Where(m => m.Value.Errors.Any())
                              .Select(m => $"{m.Key}: {m.Value.Errors.First().ErrorMessage}")
                    ));
            }

            return View(note);
        }

        // GET: Notes/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null) return NotFound();

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var note = await _context.Notes.FirstOrDefaultAsync(n => n.NoteId == id && n.UserId == user.Id);
            if (note == null) return NotFound();
            
            return View(note);
        }

        // POST: Notes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("NoteId,Title,ContentMarkdown,CreatedAt,UpdatedAt,Category")] Note note)
        {
            if (id != note.NoteId) return NotFound();

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var existingNote = await _context.Notes.AsNoTracking().FirstOrDefaultAsync(n => n.NoteId == id && n.UserId == user.Id);
            if (existingNote == null) return NotFound();

            note.UserId = user.Id; // Ensure ownership is preserved

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(note);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!NoteExists(note.NoteId)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(note);
        }

        // GET: Notes/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null) return NotFound();

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var note = await _context.Notes
                .Include(n => n.User)
                .FirstOrDefaultAsync(m => m.NoteId == id && m.UserId == user.Id);

            if (note == null) return NotFound();

            return View(note);
        }

        // POST: Notes/Delete/5
        // POST: Notes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var note = await _context.Notes.FirstOrDefaultAsync(n => n.NoteId == id && n.UserId == user.Id);
            if (note != null)
            {
                _context.Notes.Remove(note);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool NoteExists(Guid id)
        {
            return _context.Notes.Any(e => e.NoteId == id);
        }

        // API: GET all notes
        [HttpGet]
        public async Task<IActionResult> GetNotes()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var notes = await _context.Notes
                .Where(n => n.UserId == user.Id)
                .OrderByDescending(n => n.UpdatedAt)
                .Select(n => new
                {
                    id = n.NoteId,
                    title = n.Title,
                    body = n.ContentMarkdown,
                    updatedAt = n.UpdatedAt
                })
                .ToListAsync();

            return Json(notes);
        }

        // API: POST create note
        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] NoteRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var note = new Note
            {
                NoteId = Guid.NewGuid(),
                UserId = user.Id,
                Title = request.Title ?? "Untitled",
                ContentMarkdown = request.Body,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return Json(new { id = note.NoteId, title = note.Title, body = note.ContentMarkdown, updatedAt = note.UpdatedAt });
        }

        // API: PUT update note
        [HttpPut]
        public async Task<IActionResult> UpdateNote([FromBody] NoteRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            if (request.Id == null) return BadRequest();

            var note = await _context.Notes.FirstOrDefaultAsync(n => n.NoteId == request.Id && n.UserId == user.Id);
            if (note == null) return NotFound();

            note.Title = request.Title ?? "Untitled";
            note.ContentMarkdown = request.Body;
            note.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }

        // API: DELETE note
        [HttpDelete]
        public async Task<IActionResult> DeleteNote(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var note = await _context.Notes.FirstOrDefaultAsync(n => n.NoteId == id && n.UserId == user.Id);
            if (note == null) return NotFound();

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }
    }

    public class NoteRequest
    {
        public Guid? Id { get; set; }
        public string? Title { get; set; }
        public string? Body { get; set; }
    }
}
