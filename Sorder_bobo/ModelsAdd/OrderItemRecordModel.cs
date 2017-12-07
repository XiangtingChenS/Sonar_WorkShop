using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class OrderItemRecordModel
    {
        public string ProductID { get; set; }

        public string ProductName { get; set; }

        public int Quantity { get; set; }

        public int TotalPrice { get; set; }
        
    }
}