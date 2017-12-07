using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class CustomerOrderInfoModel
    {
       public string CustomerName { get; set; }

       public string CustomerPhone { get; set; }

       public string OrderID { get; set; }

       public int TotalAmount { get; set; }

       public string OrderDetail { get; set; }
    }
}