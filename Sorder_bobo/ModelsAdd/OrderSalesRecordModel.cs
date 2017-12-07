using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsAdd
{
    public class OrderSalesRecordModel
    {
        /// <summary>
        /// 年 是顯示 月份
        /// </summary>
       // public List<string> MonthForYear = new List<string>();

        public List<SalesRecordTableData> salesRecordTableData = new List<SalesRecordTableData>();

        /// <summary>
        /// 月 是顯示 日
        /// </summary>
        //public List<string> DayForMonth = new List<string>();

        /// <summary>
        /// 日 是顯示 時間
        /// </summary>
      //  public List<string> TimeForDay = new List<string>();

       // public List<int> PeriodTotalPrice = new List<int>();

        public int LastQuarterSalesAmount { get; set; }

        public int CurrentQuarterSalesAmount { get; set; }

        public int Growth { get; set;}

    }

   public class SalesRecordTableData {

        public string DateOrTime { get; set; }

        public int PeriodTotalPric1e  { get; set; }

    }
}