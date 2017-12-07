using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class RemarkGroupAndRemarkModel
    {
        public string ProductGroupID { get; set; }

        public string RemarkGroupID { get; set; }

        public string ProductGroupTypeName { get; set; }

        public string RemarkGroupTypeName { get; set; }

        public string RemarkNames { get; set; }

        public List<string> RemarkIDs_list { get; set; }

        public List<string> RemarkNames_list { get;set; }

        

    }
}