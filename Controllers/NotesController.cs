using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Codexly.Models;

namespace Codexly.Controllers
{
    [Authorize] // Only logged-in users can access Notes
    public class NotesController : Controller
    {
        private readonly IRepository<Note> _repo;
        private readonly UserManager<IdentityUser> _userManager;

        //  Inject the repository and UserManager to access current user
        public NotesController(IRepository<Note> repo, UserManager<IdentityUser> userManager)
        {
            _repo = repo;
            _userManager = userManager;
        }

        // INDEX: List all notes owned by current user
        public async Task<IActionResult> Index()
        {
            var userGuid = Guid.Parse(_userManager.GetUserId(User)); // get logged in user id
            var queryOptions = new QueryOptions<Note>();
            var notes = await _repo.GetAllByIdAsync(userGuid, nameof(Note.UserId), queryOptions);
            return View(notes);
        }

        // DETAILS: Show a single note owned by current user
        public async Task<IActionResult> Details(Guid id)
        {
            var userGuid = Guid.Parse(_userManager.GetUserId(User));
            var notes = await _repo.GetAllByIdAsync(userGuid, nameof(Note.UserId), new QueryOptions<Note>());
            var note = notes.FirstOrDefault(n => n.NoteId == id);
            if (note == null) return NotFound(); //  prevents accessing someone else's note
            return View(note);
        }

        // CREATE: GET form
        public IActionResult Create()
        {
            return View();
        }

        // CREATE: POST form submission
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Note note)
        {
            if (ModelState.IsValid)
            {
                note.NoteId = Guid.NewGuid();
                note.CreatedAt = DateTime.Now;

                //  Assign ownership to current user
                note.UserId = Guid.Parse(_userManager.GetUserId(User));

                await _repo.AddAsync(note);
                return RedirectToAction(nameof(Index));
            }
            return View(note);
        }

        // EDIT: GET form
        public async Task<IActionResult> Edit(Guid id)
        {
            var userGuid = Guid.Parse(_userManager.GetUserId(User));
            var notes = await _repo.GetAllByIdAsync(userGuid, nameof(Note.UserId), new QueryOptions<Note>());
            var note = notes.FirstOrDefault(n => n.NoteId == id);
            if (note == null) return NotFound(); //  ownership check
            return View(note);
        }

        // EDIT: POST form submission
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, Note note)
        {
            if (id != note.NoteId) return BadRequest();

            var userGuid = Guid.Parse(_userManager.GetUserId(User));
            if (note.UserId != userGuid) return Unauthorized(); //  ensure user owns the note

            if (ModelState.IsValid)
            {
                note.UpdatedAt = DateTime.Now;
                await _repo.UpdateAsync(note);
                return RedirectToAction(nameof(Index));
            }
            return View(note);
        }

        // DELETE: GET confirmation page
        public async Task<IActionResult> Delete(Guid id)
        {
            var userGuid = Guid.Parse(_userManager.GetUserId(User));
            var notes = await _repo.GetAllByIdAsync(userGuid, nameof(Note.UserId), new QueryOptions<Note>());
            var note = notes.FirstOrDefault(n => n.NoteId == id);
            if (note == null) return NotFound(); //  ownership check
            return View(note);
        }

        // DELETE: POST form submission
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var userGuid = Guid.Parse(_userManager.GetUserId(User));
            var notes = await _repo.GetAllByIdAsync(userGuid, nameof(Note.UserId), new QueryOptions<Note>());
            var note = notes.FirstOrDefault(n => n.NoteId == id);
            if (note == null) return NotFound(); // ownership check

            await _repo.DeleteAsync(id);
            return RedirectToAction(nameof(Index));
        }
    }
}
