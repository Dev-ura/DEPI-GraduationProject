using Microsoft.AspNetCore.Mvc;

namespace Account_Test.Controllers
{
    public class PageController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
