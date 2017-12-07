using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class OrderDetailModel
    {
        public String OrderDetailID { get; set; }

        public String ProductID { get; set; }

        public String ProductName { get; set; }

        public int Quantity { get; set; }

        //一種食物可能會對應到多個備註
        //ex: 奶茶 會對應到  半糖 和 少冰 的備註
        public List<String> Remark = new List<string>();

    }
}