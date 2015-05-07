using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TokenAuthMVC.Attributes;

namespace TokenAuthMVC.Controllers
{
    [RESTAuthorize]
    public class ApiController : Controller
    {
        private string[] _people = new string[] { "John Doe", "Amy Rose", "Harry Sam" };

        public JsonResult Find(string q)
        {
            var data = _people.Where(p => p.ToLower().Contains(q));

            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}