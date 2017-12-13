using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace DigitalSignage.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View("Views/Home/Index.cshtml");
        }

        public IActionResult Login()
        {
            return View("Views/Home/login.cshtml");
        }

        public IActionResult Dashboard()
        {
            return View("Views/Home/dashboard.cshtml");
        }
    }
}
