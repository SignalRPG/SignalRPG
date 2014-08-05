using SignalRPG.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SignalRPG.Controllers
{
    public class DevController : Controller
    {
        // GET: Dev
        public ActionResult Index()
        {
            return View();
        }

        // GET: Dev/MapGenerator
        public ActionResult MapGenerator()
        {
            var m = new Class1();
            return View(m);
        }

        // GET: Dev/MapGenerator
        [HttpPost]
        public ActionResult MapGenerator(Class1 m)
        {
            return View(m);
        }

        // GET: Dev/GameTest
        public ActionResult GameTest()
        {
            return View();
        }
    }
}