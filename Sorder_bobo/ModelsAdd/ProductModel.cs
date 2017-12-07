using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class ProductModel
    {
        public string ProductID { get; set; }

        public string ProductName { get; set; }

        public int ProductPrice { get; set; }

        public int ProductStatus { get; set; }

        public string ProductImage { get; set; }

        public string ProductGroupID { get; set; }

        public string ProductGroupName { get; set; }

        public DateTime ProductCreateDateTime { get; set; }


    }
}