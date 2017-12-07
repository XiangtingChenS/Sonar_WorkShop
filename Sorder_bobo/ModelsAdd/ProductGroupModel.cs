using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class ProductGroupModel
    {
        public  String ProductGroupID { get; set; }

        public String ProductGroupTypeName { get; set; }

        /// <summary>
        /// 由ProductGroupRemarkStatus 決定 orderDetailModals.Remark 要印一個還是多個
        /// </summary>
        public int ProductGroupRemarkStatus { get; set; }

        public int ProductGroupDisplayStatus { get; set; }
     
        public List<OrderDetailModel> orderDetails = new List<OrderDetailModel>();
    }
}