using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Account_Test.Data;
using Account_Test.Models;

namespace Account_Test.Controllers
{
    [Authorize]
    public class TodoListController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public TodoListController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: TodoList
        public IActionResult Index()
        {
            return View();
        }

        // API: GET all plans with their tasks
        [HttpGet]
        public async Task<IActionResult> GetPlans()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var plans = await _context.Plans
                .Where(p => p.UserId == user.Id)
                .Include(p => p.Todos)
                .OrderBy(p => p.CreatedAt)
                .Select(p => new
                {
                    id = p.PlanId,
                    title = p.Title,
                    createdAt = p.CreatedAt,
                    tasks = p.Todos.Select(t => new
                    {
                        id = t.TodoId,
                        title = t.Title,
                        isCompleted = t.IsCompleted
                    }).ToList()
                })
                .ToListAsync();

            return Json(plans);
        }

        // API: POST create a new plan
        [HttpPost]
        public async Task<IActionResult> CreatePlan([FromBody] CreatePlanRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            if (string.IsNullOrWhiteSpace(request.Title))
                return BadRequest(new { error = "Title is required" });

            var plan = new Plan
            {
                PlanId = Guid.NewGuid(),
                UserId = user.Id,
                Title = request.Title,
                CreatedAt = DateTime.Now
            };

            _context.Plans.Add(plan);
            await _context.SaveChangesAsync();

            return Json(new { id = plan.PlanId, title = plan.Title, createdAt = plan.CreatedAt, tasks = new List<object>() });
        }

        // API: PUT update plan title
        [HttpPut]
        public async Task<IActionResult> UpdatePlan([FromBody] UpdatePlanRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var plan = await _context.Plans
                .FirstOrDefaultAsync(p => p.PlanId == request.Id && p.UserId == user.Id);

            if (plan == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(request.Title))
                plan.Title = request.Title;

            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }

        // API: DELETE delete a plan and all its tasks
        [HttpDelete]
        public async Task<IActionResult> DeletePlan(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var plan = await _context.Plans
                .Include(p => p.Todos)
                .FirstOrDefaultAsync(p => p.PlanId == id && p.UserId == user.Id);

            if (plan == null) return NotFound();

            _context.Plans.Remove(plan);
            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }

        // API: POST create a new task
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            if (string.IsNullOrWhiteSpace(request.Title))
                return BadRequest(new { error = "Title is required" });

            // Verify plan belongs to user
            var plan = await _context.Plans
                .FirstOrDefaultAsync(p => p.PlanId == request.PlanId && p.UserId == user.Id);

            if (plan == null) return NotFound(new { error = "Plan not found" });

            var task = new Todo
            {
                TodoId = Guid.NewGuid(),
                UserId = user.Id,
                PlanId = request.PlanId,
                Title = request.Title,
                IsCompleted = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Todos.Add(task);
            await _context.SaveChangesAsync();

            return Json(new { id = task.TodoId, title = task.Title, isCompleted = task.IsCompleted });
        }

        // API: PUT update task
        [HttpPut]
        public async Task<IActionResult> UpdateTask([FromBody] UpdateTaskRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var task = await _context.Todos
                .FirstOrDefaultAsync(t => t.TodoId == request.Id && t.UserId == user.Id);

            if (task == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(request.Title))
                task.Title = request.Title;

            if (request.IsCompleted.HasValue)
                task.IsCompleted = request.IsCompleted.Value;

            task.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }

        // API: DELETE delete a task
        [HttpDelete]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var task = await _context.Todos
                .FirstOrDefaultAsync(t => t.TodoId == id && t.UserId == user.Id);

            if (task == null) return NotFound();

            _context.Todos.Remove(task);
            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }
    }

    // Request models
    public class CreatePlanRequest
    {
        public string Title { get; set; } = null!;
    }

    public class UpdatePlanRequest
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
    }

    public class CreateTaskRequest
    {
        public Guid PlanId { get; set; }
        public string Title { get; set; } = null!;
    }

    public class UpdateTaskRequest
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public bool? IsCompleted { get; set; }
    }
}
