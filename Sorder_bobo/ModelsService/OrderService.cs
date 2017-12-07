using Sorder_bobo.Models;
using Sorder_bobo.ModelsAdd;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace Sorder_bobo.ModelsService
{
    public class OrderService
    {
        SorderDB sorderDB = new SorderDB();

        /// <summary>
        /// 取得訂單歷史資料
        /// </summary>
        /// <returns></returns>
        public List<OrderHistoryModel> GetOrderHistory(String StoreID)
        {
            List<OrderHistoryModel> OHMs = new List<OrderHistoryModel>();

            //status 0新訂單  1進行中  2已完成未結單  3已取貨 
            var O = sorderDB.Orders
                    .Where(x => x.StoreID == StoreID && x.Status == 3)
                    .Select(x => new
                    {
                        x.OrderID,
                        x.OrderDateTime
                    })
                     .ToList();

            foreach (var o in O)
            {
                var OD = sorderDB.OrderDetail
                         .Where(x => x.OrderID == o.OrderID)
                         .Select(x => new
                         {
                             x.OrderID,
                             x.Product.ProductName,
                             x.Quantity,
                             x.Product.ProductPrice
                         })
                         .ToList();

                List<string> OrderContent = new List<string>();
                int totalPrice = 0;
                foreach (var od in OD)
                {
                    OrderContent.Add(od.ProductName + "*" + od.Quantity + " ");
                    totalPrice += od.ProductPrice * od.Quantity;
                }

                string OrderDate = o.OrderDateTime.Year + "/" + o.OrderDateTime.Month + "/" + o.OrderDateTime.Day;
                string OrderTime = TimefillZero(o.OrderDateTime.TimeOfDay.Hours) + ":" + TimefillZero(o.OrderDateTime.TimeOfDay.Minutes);
                OrderHistoryModel OHM = new OrderHistoryModel()
                {
                    OrderID = o.OrderID,
                    OrderDateTime = OrderDate + " "+ OrderTime,
                    OrderContent = OrderContent,
                    TotalPrice = totalPrice
                };
                OHMs.Add(OHM);
            }

            return OHMs;
        }

        public string TimefillZero(int time)
        {
            string time_str = time.ToString();
            if (time_str == "0")
            {
                // 18:0 - >18:00
                return "00";
            }
            else if (time_str.Length == 1)
            {
                // 10:2  ->  10:02
                return "0" + time;
            }
            return time_str;
        }



        /// <summary>
        /// 取得新訂單ID(訂單狀態等於0)
        /// </summary>
        /// <param name="StoreID"></param>
        /// <returns></returns>
        public List<OrderModel> GetNewOrders(String StoreID)
        {
            List<OrderModel> OMs = new List<OrderModel>();

            var orders = sorderDB.Orders
                    .Where(x => x.StoreID == StoreID && x.Status == 0)
                    .Select(x => new
                    {
                        x.OrderID,
                        x.OrderDateTime
                    })
                    .OrderBy(x => x.OrderDateTime)
                    .ToList();

            foreach (var order in orders)
            {
                OrderModel OM = new OrderModel()
                {
                    OrderID = order.OrderID,
                    OrderDateTime = order.OrderDateTime,
                    OrderTime = order.OrderDateTime.TimeOfDay
                };
                OMs.Add(OM);
            }

            return OMs;
        }


        public List<OrderModel> GetNewOrdersByLastestOrderTime(String StoreID, DateTime LastestOrderTime)
        {
            List<OrderModel> OMs = new List<OrderModel>();

            var orders = sorderDB.Orders
                    .Where(x => x.StoreID == StoreID && x.Status == 0 && x.OrderDateTime > LastestOrderTime)
                    .Select(x => new
                    {
                        x.OrderID,
                        x.OrderDateTime
                    })
                    .OrderBy(x => x.OrderDateTime)
                    .ToList();

            foreach (var order in orders)
            {
                OrderModel OM = new OrderModel()
                {
                    OrderID = order.OrderID,
                    OrderDateTime = order.OrderDateTime,
                    OrderTime = order.OrderDateTime.TimeOfDay
                };
                OMs.Add(OM);
            }

            return OMs;
        }

        /// <summary>
        /// 取得全部取消訂單狀態的orderID
        /// </summary>
        /// <param name="StoreID"></param>
        /// <returns></returns>
        public List<string> GetCanceledStatusOrders(String StoreID) {
            var orders = sorderDB.Orders
                        .Where(x => x.StoreID == StoreID && x.Status == 4)
                        .Select(x => new{
                            x.OrderID
                        }).ToList();

            List<string> orderIDs = new List<string>();
            foreach(var o in orders) {
                orderIDs.Add(o.OrderID);
            }

            return orderIDs;
        }
        

       public List<OrderModel> GetProcessingOrders(String StoreID)
        {

            List<OrderModel> OMs = new List<OrderModel>();

            var Os = sorderDB.Orders
                       .Where(x => x.StoreID == StoreID && x.Status == 1)
                       .Select(x => new
                       {
                           x.OrderID,
                           x.OrderDateTime,
                           OrderRemark = x.Remark,
                           NFCID = x.NFC,
                           Status = x.Status,
                           OrderDetail = x.OrderDetail.Select(y => new
                           {
                               y.OrderDetailID,
                               productName = y.Product.ProductName,
                               y.Quantity,
                               productGroupTypeName = y.Product.ProductGroup.ProductGroupTypeName,
                               productGroupRemarkStatus = y.Product.ProductGroup.ProductGroupRemarkStatus,
                               remark = y.OrderDetailRemark.Select(odr => new
                               {
                                   odr.RemarkID,
                                   odr.Remark.RemarkName
                               }).OrderByDescending(odr=>odr.RemarkID)
                           })
                       })
                      .OrderBy(x => x.OrderDateTime)
                     .ToList();

            foreach (var O in Os)
            {

                Dictionary<string, ProductGroupModel> PGMs = new Dictionary<string, ProductGroupModel>();
                foreach (var OD in O.OrderDetail)
                {
                    //一個產品可能有多種口味 ex:半糖+少冰
                    List<String> Rs = new List<string>();
                    foreach (var R in OD.remark)
                    {
                        Rs.Add(R.RemarkName);
                    }

                    OrderDetailModel odm = new OrderDetailModel()
                    {
                        OrderDetailID = OD.OrderDetailID,
                        ProductName = OD.productName,
                        Quantity = OD.Quantity,
                        Remark = Rs
                    };

                    //以產品群組為key 
                    string productGroupTypeName = OD.productGroupTypeName;
                    if (PGMs.ContainsKey(productGroupTypeName))
                    {
                        PGMs[productGroupTypeName].orderDetails.Add(odm);
                    }
                    else
                    {
                        ProductGroupModel pgm = new ProductGroupModel()
                        {
                            ProductGroupTypeName = OD.productGroupTypeName,
                            ProductGroupRemarkStatus = OD.productGroupRemarkStatus
                        };
                        pgm.orderDetails.Add(odm);

                        PGMs.Add(productGroupTypeName, pgm);
                    }
                }

                OrderModel om = new OrderModel()
                {
                    OrderID = O.OrderID,
                    OrderDateTime = O.OrderDateTime,
                 //   OrderRemark = O.OrderRemark,
                    NFCID = O.NFCID,
                    Status = O.Status,
                    productGroupModelsByOrderDetail = PGMs
                };

                if (O.OrderRemark == null || O.OrderRemark == ""){
                    om.OrderRemark = "無";
                }
                else {
                    om.OrderRemark = O.OrderRemark;
                }

                OMs.Add(om);
            }

            return OMs;
        }


        public void UpdateOrderStatus_Finish(String StoreID, String OrderID)
        {

            var order = sorderDB.Orders
                          .Where(x => x.StoreID == StoreID && x.OrderID == OrderID).First();

            order.Status = 2;
           // order.NFC = null;  //取貨完成時，才能清除nfc
            sorderDB.SaveChanges();
        }


        public OrderModel GetOrderByNFCID(String StoreID, string NFCID)
        {
         //  var existOrder  = GetExistOrderByNFCID(StoreID, NFCID);
            var existOrder = sorderDB.Orders
                      .Where(x => x.StoreID == StoreID && x.NFC == NFCID)
                      .Select(x => new
                      {
                          x.OrderID,
                          x.OrderDateTime,
                          OrderRemark = x.Remark,
                          NFCID = x.NFC,
                          Status = x.Status,
                          OrderDetail = x.OrderDetail.Select(y => new
                          {
                              y.OrderDetailID,
                              productName = y.Product.ProductName,
                              y.Quantity,
                              productGroupTypeName = y.Product.ProductGroup.ProductGroupTypeName,
                              productGroupRemarkStatus = y.Product.ProductGroup.ProductGroupRemarkStatus,
                              remark = y.OrderDetailRemark.Select(odr => new
                              {
                                  odr.RemarkID,
                                  odr.Remark.RemarkName
                              }).OrderByDescending(odr => odr.RemarkID)
                          })
                      })
                    .ToArray();

            if (existOrder.Length == 0) {
                //訂單狀態為0，且訂購時間最早的  ->  綁定nfcID

                try{
                    var earliestOrder = sorderDB.Orders
                      .Where(x => x.StoreID == StoreID && x.Status == 0)
                      .OrderBy(x => x.OrderDateTime)
                      .First();
                    earliestOrder.NFC = NFCID;
                    earliestOrder.Status = 1;
                    sorderDB.SaveChanges();
                }
                catch (Exception e) {
                    return null;
                }
               

              //  existOrder = GetExistOrderByNFCID(StoreID, NFCID);

                 existOrder = sorderDB.Orders
                          .Where(x => x.StoreID == StoreID && x.NFC == NFCID)
                          .Select(x => new
                          {
                              x.OrderID,
                              x.OrderDateTime,
                              OrderRemark = x.Remark,
                              NFCID = x.NFC,
                              Status = x.Status,
                              OrderDetail = x.OrderDetail.Select(y => new
                              {
                                  y.OrderDetailID,
                                  productName = y.Product.ProductName,
                                  y.Quantity,
                                  productGroupTypeName = y.Product.ProductGroup.ProductGroupTypeName,
                                  productGroupRemarkStatus = y.Product.ProductGroup.ProductGroupRemarkStatus,
                                  remark = y.OrderDetailRemark.Select(odr => new
                                  {
                                      odr.RemarkID,
                                      odr.Remark.RemarkName
                                  }).OrderByDescending(odr => odr.RemarkID)
                              })
                          })
                        .ToArray();
            }

            Dictionary<string, ProductGroupModel> PGMs = new Dictionary<string, ProductGroupModel>();
            foreach (var OD in existOrder[0].OrderDetail)
            {
                //一個產品可能有多種口味 ex:半糖+少冰
                List<String> Rs = new List<string>();
                foreach (var R in OD.remark)
                {
                    Rs.Add(R.RemarkName);
                }

                OrderDetailModel odm = new OrderDetailModel()
                {
                    OrderDetailID = OD.OrderDetailID,
                    ProductName = OD.productName,
                    Quantity = OD.Quantity,
                    Remark = Rs
                };

                //以產品群組為key 
                string productGroupTypeName = OD.productGroupTypeName;
                if (PGMs.ContainsKey(productGroupTypeName))
                {
                    PGMs[productGroupTypeName].orderDetails.Add(odm);
                }
                else
                {
                    ProductGroupModel pgm = new ProductGroupModel()
                    {
                        ProductGroupTypeName = OD.productGroupTypeName,
                        ProductGroupRemarkStatus = OD.productGroupRemarkStatus
                    };
                    pgm.orderDetails.Add(odm);

                    PGMs.Add(productGroupTypeName, pgm);
                }
            }

            //這裡的OrderRemark沒防呆
            //OrderRemark == null || OrderRemark == "" ->  OrderRemark == 無
            OrderModel om = new OrderModel()
            {
                OrderID = existOrder[0].OrderID,
                OrderDateTime = existOrder[0].OrderDateTime,
                //OrderRemark = existOrder[0].OrderRemark,
                NFCID = existOrder[0].NFCID,
                Status = existOrder[0].Status,
                productGroupModelsByOrderDetail = PGMs
            };

            if (existOrder[0].OrderRemark == null || existOrder[0].OrderRemark == "")
            {
                om.OrderRemark = "無";
            }
            else
            {
                om.OrderRemark = existOrder[0].OrderRemark;
            }

            return om;
        }


        //public object GetExistOrderByNFCID(String StoreID, int? NFCID)
        //{
        //    var existOrder = sorderDB.Orders
        //             .Where(x => x.StoreID == StoreID && x.NFC == NFCID)
        //             .Select(x => new
        //             {
        //                 x.OrderID,
        //                 x.OrderDateTime,
        //                 OrderRemark = x.Remark,
        //                 NFCID = x.NFC,
        //                 OrderDetail = x.OrderDetail.Select(y => new
        //                 {
        //                     y.OrderDetailID,
        //                     productName = y.Product.ProductName,
        //                     y.Quantity,
        //                     productGroupTypeName = y.Product.ProductGroup.ProductGroupTypeName,
        //                     productGroupRemarkStatus = y.Product.ProductGroup.ProductGroupRemarkStatus,
        //                     remark = y.OrderDetailRemark.Select(odr => new
        //                     {
        //                         odr.RemarkID,
        //                         odr.Remark.RemarkName
        //                     })
        //                 })
        //             })
        //           .First();

        //    return existOrder;
        //}


        public CustomerOrderInfoModel GetCustomerOrderInfo(string OrderID)
        {
            try {
                var O = sorderDB.Orders
                 .Where(x => x.OrderID == OrderID)
                 .First();
                O.Status = 3; //0新訂單  1進行中  2已完成未結單  3已取貨 
                O.NFC = null;
                sorderDB.SaveChanges();

                var CusOrder = sorderDB.Orders
                                 .Where(x => x.OrderID == OrderID)
                                 .Select(x => new
                                 {
                                     x.OrderID,
                                     x.Customer.CustomerName,
                                     x.Customer.CustomerPhone,
                                     totalAmount = x.OrderDetail
                                                    .Where(OD => OD.OrderID == OrderID)
                                                    .Sum(OD => OD.Quantity * OD.Product.ProductPrice),
                                     OrderDetails = x.OrderDetail
                                                    .Where(OD => OD.OrderID == OrderID)
                                                    .Select(OD => new {
                                                        good = OD.Product.ProductName + "*" + OD.Quantity
                                                    }).ToList()
                                 })
                                 .First();

                string OrderDetail_string = "";
                foreach (var OD in CusOrder.OrderDetails)
                {
                    OrderDetail_string += OD.good + " ";
                }
                OrderDetail_string = OrderDetail_string.Trim().Replace(' ', ',');

                CustomerOrderInfoModel COIM = new CustomerOrderInfoModel()
                {
                    OrderID = CusOrder.OrderID,
                    CustomerName = CusOrder.CustomerName,
                    CustomerPhone = CusOrder.CustomerPhone,
                    TotalAmount = CusOrder.totalAmount,
                    OrderDetail = OrderDetail_string
                };

                return COIM;

            }
            catch (Exception e) {
                //要用null 才會拋到前端的error，並不是因為放在catch(後來才發現的)
                return null;
            }

        }

        public List<CustomerOrderInfoModel> GetNotifyOrderCusListByProductID(string StoreID, string ProductID) {

            var Os = sorderDB.Orders
                     .Select(x => new
                     {
                         x.StoreID,
                         x.OrderID,
                         x.Status,
                         x.Customer.CustomerName,
                         x.Customer.CustomerPhone,
                         OD = x.OrderDetail
                           .Where(OD => OD.ProductID == ProductID)
                           .ToList()
                     })
                     .Where(x => x.StoreID == StoreID && (x.Status == 0 || x.Status == 1) && x.OD.Count > 0)
                     .ToList();

            List<CustomerOrderInfoModel> Cs = new List<CustomerOrderInfoModel>();
            foreach (var O in Os)
            {
                CustomerOrderInfoModel C = new CustomerOrderInfoModel()
                {
                    OrderID = O.OrderID,
                    CustomerName = O.CustomerName,
                    CustomerPhone = O.CustomerPhone
                };
                Cs.Add(C);
            }

            return Cs;
        }

        //status 0新訂單  1進行中  2已完成未結單  3已取貨

        //品項銷售分析資料 - 日
        public List<OrderItemRecordModel> GetOrderItemRecordsByDay(string StoreID, DateTime day) {

         var items =  sorderDB.Orders
                              .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == day.Year 
                                       && x.OrderDateTime.Month == day.Month && x.OrderDateTime.Day == day.Day
                                       && x.Status == 3)
                              .Select(x => new{
                                 ODs = x.OrderDetail.Select(OD=>new {
                                            OD.ProductID,
                                            OD.Product.ProductName,
                                            OD.Quantity,
                                            OD.Product.ProductPrice
                                      })
                              })
                              .ToList();

            Dictionary<string, OrderItemRecordModel> OIRMs = new Dictionary<string, OrderItemRecordModel>();
            foreach (var item in items) {
                foreach (var OD in item.ODs) {

                    if (OIRMs.ContainsKey(OD.ProductID))
                    {
                        OIRMs[OD.ProductID].Quantity += OD.Quantity;
                        OIRMs[OD.ProductID].TotalPrice += OD.Quantity * OD.ProductPrice;
                    }
                    else {
                        OrderItemRecordModel OIRM = new OrderItemRecordModel()
                        {
                            ProductID = OD.ProductID,
                            ProductName = OD.ProductName,
                            Quantity = OD.Quantity,
                            TotalPrice = OD.ProductPrice * OD.Quantity
                        };
                        OIRMs.Add(OD.ProductID, OIRM);
                    }

                   
                }
            }

            return OIRMs.Values.ToList();
        }

        //品項銷售分析資料 - 月
        public List<OrderItemRecordModel> GetOrderItemRecordsByMonth(string StoreID, DateTime month)
        {
            var items = sorderDB.Orders
                                 .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == month.Year
                                          && x.OrderDateTime.Month == month.Month && x.Status == 3)
                                 .Select(x => new {
                                     ODs = x.OrderDetail.Select(OD => new {
                                         OD.ProductID,
                                         OD.Product.ProductName,
                                         OD.Quantity,
                                         OD.Product.ProductPrice
                                     })
                                 })
                                 .ToList();

            Dictionary<string, OrderItemRecordModel> OIRMs = new Dictionary<string, OrderItemRecordModel>();
            foreach (var item in items)
            {
                foreach (var OD in item.ODs)
                {

                    if (OIRMs.ContainsKey(OD.ProductID))
                    {
                        OIRMs[OD.ProductID].Quantity += OD.Quantity;
                        OIRMs[OD.ProductID].TotalPrice += OD.Quantity * OD.ProductPrice;
                    }
                    else
                    {
                        OrderItemRecordModel OIRM = new OrderItemRecordModel()
                        {
                            ProductID = OD.ProductID,
                            ProductName = OD.ProductName,
                            Quantity = OD.Quantity,
                            TotalPrice = OD.ProductPrice * OD.Quantity
                        };
                        OIRMs.Add(OD.ProductID, OIRM);
                    }


                }
            }

            return OIRMs.Values.ToList();
        }

        //品項銷售分析資料 - 年
        public List<OrderItemRecordModel> GetOrderItemRecordsByYear(string StoreID, DateTime year)
        {

            var items = sorderDB.Orders
                                 .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == year.Year
                                 && x.Status == 3)
                                 .Select(x => new {
                                     ODs = x.OrderDetail.Select(OD => new {
                                         OD.ProductID,
                                         OD.Product.ProductName,
                                         OD.Quantity,
                                         OD.Product.ProductPrice
                                     })
                                 })
                                 .ToList();

            Dictionary<string, OrderItemRecordModel> OIRMs = new Dictionary<string, OrderItemRecordModel>();
            foreach (var item in items)
            {
                foreach (var OD in item.ODs)
                {

                    if (OIRMs.ContainsKey(OD.ProductID))
                    {
                        OIRMs[OD.ProductID].Quantity += OD.Quantity;
                        OIRMs[OD.ProductID].TotalPrice += OD.Quantity * OD.ProductPrice;
                    }
                    else
                    {
                        OrderItemRecordModel OIRM = new OrderItemRecordModel()
                        {
                            ProductID = OD.ProductID,
                            ProductName = OD.ProductName,
                            Quantity = OD.Quantity,
                            TotalPrice = OD.ProductPrice * OD.Quantity
                        };
                        OIRMs.Add(OD.ProductID, OIRM);
                    }


                }
            }

            return OIRMs.Values.ToList();
        }

        //業績報表資料 - 日
        public OrderSalesRecordModel GetOrderSalesRecordsByDay(string StoreID, DateTime date)
        {
            var SRs = sorderDB.Orders
                     .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == date.Year
                              && x.OrderDateTime.Month == date.Month && x.OrderDateTime.Day == date.Day
                              && x.Status == 3)
                    .GroupBy(x => x.OrderDateTime.Hour)
                    .Select(x => new {
                        hour = x.Key,
                        hourTotalAmount = x.Select(w =>
                                                w.OrderDetail.Select(OD => OD.Quantity * OD.Product.ProductPrice).Sum()
                                        ).Sum()
                    }).ToList();

            OrderSalesRecordModel OSRM = new OrderSalesRecordModel();
            int currentDaySalesAmount = 0;
            foreach (var SR in SRs)
            {
                currentDaySalesAmount += SR.hourTotalAmount;
                SalesRecordTableData SRTD = new SalesRecordTableData()
                {
                    DateOrTime = SR.hour +":00 ~ "+ SR.hour + ":59",
                    PeriodTotalPric1e = SR.hourTotalAmount
                };
                OSRM.salesRecordTableData.Add(SRTD);
            }
            OSRM.CurrentQuarterSalesAmount = currentDaySalesAmount;

            int yesterDaySalesAmount = 0;
            try
            {
                yesterDaySalesAmount = sorderDB.Orders
                           .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == date.Year
                              && x.OrderDateTime.Month == date.Month && x.OrderDateTime.Day == (date.Day-1))
                           .Select(x => x.OrderDetail.Select(OD => OD.Quantity * OD.Product.ProductPrice).Sum())
                           .Sum();
            }
            catch (Exception)
            {
                yesterDaySalesAmount = 0;
            }

            OSRM.LastQuarterSalesAmount = yesterDaySalesAmount;
            OSRM.Growth = currentDaySalesAmount - yesterDaySalesAmount;

            return OSRM;
        }

        //業績報表資料 - 月
        public OrderSalesRecordModel GetOrderSalesRecordsByMonth(string StoreID, DateTime month)
        {
            var SRs = sorderDB.Orders
                       .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == month.Year
                                && x.OrderDateTime.Month == month.Month
                                && x.Status == 3)
                        .GroupBy(x => x.OrderDateTime.Day)
                        .Select(x => new {
                            Day = x.Key,
                            monthTotalAmount = x.Select(w =>
                                                    w.OrderDetail.Select(OD => OD.Quantity * OD.Product.ProductPrice).Sum()
                                            ).Sum()
                        }).ToList();

            OrderSalesRecordModel OSRM = new OrderSalesRecordModel();

            int currentMonthSalesAmount = 0;
            foreach (var SR in SRs)
            {
                currentMonthSalesAmount += SR.monthTotalAmount;
                SalesRecordTableData SRTD = new SalesRecordTableData()
                {
                    DateOrTime = month.Month + "/" + SR.Day.ToString(),
                    PeriodTotalPric1e = SR.monthTotalAmount
                };
                OSRM.salesRecordTableData.Add(SRTD);
            }
            OSRM.CurrentQuarterSalesAmount = currentMonthSalesAmount;

            int lastMonthSalesAmount = 0;
            try
            {
                lastMonthSalesAmount = sorderDB.Orders
                           .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == month.Year
                                && x.OrderDateTime.Month == (month.Month-1))
                           .Select(x => x.OrderDetail.Select(OD => OD.Quantity * OD.Product.ProductPrice).Sum())
                           .Sum();

            }
            catch (Exception)
            {
                lastMonthSalesAmount = 0;
            }

            OSRM.LastQuarterSalesAmount = lastMonthSalesAmount;
            OSRM.Growth = currentMonthSalesAmount - lastMonthSalesAmount;

            return OSRM;
        }

        //業績報表資料 - 年
        public OrderSalesRecordModel GetOrderSalesRecordsByYear(string StoreID, DateTime year)
        {
            var SRs = sorderDB.Orders
                                .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == year.Year
                                 && x.Status == 3)
                                .GroupBy(x => x.OrderDateTime.Month )
                                .Select(x => new {
                                    Month = x.Key,
                                    monthTotalAmount = x.Select(w => 
                                                            w.OrderDetail.Select(OD => OD.Quantity * OD.Product.ProductPrice).Sum()
                                                    ).Sum()
                                }).ToList();

            OrderSalesRecordModel OSRM = new OrderSalesRecordModel();

            int currentQuarterSalesAmount = 0;
            foreach (var SR in SRs) {
                currentQuarterSalesAmount += SR.monthTotalAmount;

                SalesRecordTableData SRTD = new SalesRecordTableData()
                {
                    DateOrTime = SR.Month.ToString(),
                    PeriodTotalPric1e = SR.monthTotalAmount
                };
                OSRM.salesRecordTableData.Add(SRTD);
            }
            OSRM.CurrentQuarterSalesAmount = currentQuarterSalesAmount;

            int lastQuarterSalesAmount = 0;
            try {
                 lastQuarterSalesAmount = sorderDB.Orders
                            .Where(x => x.StoreID == StoreID && x.OrderDateTime.Year == (year.Year - 1))
                            .Select(x => x.OrderDetail.Select(OD => OD.Quantity * OD.Product.ProductPrice).Sum())
                            .Sum();
              
            }
            catch (Exception) {
                lastQuarterSalesAmount = 0;
            }

            OSRM.LastQuarterSalesAmount = lastQuarterSalesAmount;
            OSRM.Growth = currentQuarterSalesAmount - lastQuarterSalesAmount;

            return OSRM;
        }
    }

    


}