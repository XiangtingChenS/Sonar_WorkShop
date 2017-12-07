using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class OrderHistoryModel
    {
        public string OrderID { get; set; }

     //   public string OrderDate { get; set; }

     //   public string OrderTime { get; set; }

        public string OrderDateTime { get; set; }

        public List<string> OrderContent { get; set; }

        public int TotalPrice { get; set; }

    }
}