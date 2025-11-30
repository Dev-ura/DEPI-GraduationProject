using System.Diagnostics;
using Codexly.Models;
using Microsoft.AspNetCore.Mvc;

namespace Codexly.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // Home page
        [Route("")]
        [Route("home")]
        public IActionResult Index()
        {
            return View();
        }

        // Privacy page
        [Route("privacy")]
        public IActionResult Privacy()
        {
            return View();
        }

        // Error page (leave default routing)
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        // About page
        [Route("about")]
        public IActionResult About() => View();

        // Contact page
        [Route("contact")]
        public IActionResult Contact() => View();

        // Courses page
        [Route("courses")]
        public IActionResult Courses() => View();

        // FAQ page
        [Route("faq")]
        public IActionResult Faq() => View();

        // Roadmaps page
        [Route("roadmaps")]
        public IActionResult Roadmaps() => View();

        // Terms page
        [Route("terms")]
        public IActionResult Terms() => View();

        // Dashboard page
        [Route("dashboard")]
        public IActionResult Dashboard() => View();

        [Route("whiteboard")]
        public IActionResult Whiteboard() => View();

        [Route("support")]
        public IActionResult Support() => View();
    }
}
