using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class OrderModel
    {
        public String OrderID { get; set; }

        public String NFCID { get; set; }

        public DateTime OrderDateTime { get; set; }

        //時:分
        public TimeSpan OrderTime { get; set; } 

        public DateTime DeliveryDateTime { get; set; }

        public int Status { get; set; }

        public String OrderRemark { get; set; }

        public Dictionary<string, ProductGroupModel> productGroupModelsByOrderDetail = new Dictionary<string, ProductGroupModel>();

    }
}