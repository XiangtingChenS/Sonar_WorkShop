using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class WaitTimeConfigModel
    {
        public string StoreID { get; set; }

        public int[] OrderQuantities { get; set; }

        public int[] IntervalTimes { get; set; }

        public string[] Units { get; set; }
    }
}