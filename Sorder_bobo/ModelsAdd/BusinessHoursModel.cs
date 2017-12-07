using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class BusinessHoursModel
    {
        public string[] Weeks { get; set; }

        public string[] StartTimes { get; set; }

        public string[] ClosedTimes { get; set; }
    }
}