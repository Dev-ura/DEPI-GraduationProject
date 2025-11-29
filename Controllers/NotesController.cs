using Microsoft.AspNetCore.Mvc;
using Codexly.Models;

namespace Codexly.Controllers
{
    public class NotesController : Controller
    {
        private readonly IRepository<Note> _repo;

        public NotesController(IRepository<Note> repo)
        {
            _repo = repo;
        }

        // GET: /Notes
        public async Task<IActionResult> Index()
        {
            var notes = await _repo.GetAllAsync();
            return View(notes);
        }

        // GET: /Notes/Details/{id}
        public async Task<IActionResult> Details(Guid id)
        {
            var note = await _repo.GetAllByIdAsync(id, nameof(Note.NoteId), new QueryOptions<Note>());
            var singleNote = note.FirstOrDefault();
            if (singleNote == null) return NotFound();
            return View(singleNote);
        }

        // GET: /Notes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Notes/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Note note)
        {
            if (ModelState.IsValid)
            {
                note.NoteId = Guid.NewGuid();
                note.CreatedAt = DateTime.Now;

                await _repo.AddAsync(note);
                return RedirectToAction(nameof(Index));
            }
            return View(note);
        }

        // GET: /Notes/Edit/{id}
        public async Task<IActionResult> Edit(Guid id)
        {
            var note = (await _repo.GetAllByIdAsync(id, nameof(Note.NoteId), new QueryOptions<Note>())).FirstOrDefault();
            if (note == null) return NotFound();
            return View(note);
        }

        // POST: /Notes/Edit/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, Note note)
        {
            if (id != note.NoteId) return BadRequest();

            if (ModelState.IsValid)
            {
                note.UpdatedAt = DateTime.Now;
                await _repo.UpdateAsync(note);
                return RedirectToAction(nameof(Index));
            }
            return View(note);
        }

        // GET: /Notes/Delete/{id}
        public async Task<IActionResult> Delete(Guid id)
        {
            var note = (await _repo.GetAllByIdAsync(id, nameof(Note.NoteId), new QueryOptions<Note>())).FirstOrDefault();
            if (note == null) return NotFound();
            return View(note);
        }

        // POST: /Notes/Delete/{id}
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            await _repo.DeleteAsync(id);
            return RedirectToAction(nameof(Index));
        }
    }
}
