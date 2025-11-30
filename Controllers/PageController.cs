using Microsoft.AspNetCore.Mvc;

namespace Codexly.Controllers
{
    public class PageController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
