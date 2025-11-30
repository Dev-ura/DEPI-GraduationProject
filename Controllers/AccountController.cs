using Microsoft.AspNetCore.Mvc;

namespace Account_Test.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
