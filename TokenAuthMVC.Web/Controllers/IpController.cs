using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TokenAuthMVC.Managers;

namespace TokenAuthMVC.Controllers
{
    public class IpController : Controller
    {
        [HttpGet]
        public string Index()
        {
            return CommonManager.GetIP(Request);
        }
    }
}