using Sorder_bobo.ModelsService;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Sorder_bobo.Controllers
{
    public class OrderController : Controller
    {
        OrderService orderService = new OrderService();
        ProductService productService = new ProductService();

        // GET: Order
        public ActionResult Index()
        {
          //  ViewBag.allProductGroup = productService.GetProductGroup().ToArray();
            return View();
        }

        [HttpPost]
        public JsonResult GetOrderHistory(string StoreID) {
            return this.Json(orderService.GetOrderHistory(StoreID));
        }

        [HttpPost]
        public JsonResult GetNewOrders(string StoreID)
        {
            return this.Json(orderService.GetNewOrders(StoreID));
        }

        [HttpPost]
        public JsonResult GetProcessingOrders(string StoreID)
        {
            return this.Json(orderService.GetProcessingOrders(StoreID));
        }

        
       [HttpPost]
        public JsonResult GetNewOrdersByLastestOrderTime(string StoreID, DateTime LastestOrderTime)
        {
            return this.Json(orderService.GetNewOrdersByLastestOrderTime(StoreID, LastestOrderTime));
        }

        [HttpPost]
        public JsonResult GetCanceledStatusOrders(string StoreID)
        {
            return this.Json(orderService.GetCanceledStatusOrders(StoreID));
        }


        [HttpPost]
        public void UpdateOrderStatus_Finish(string StoreID, string OrderID)
        {
           orderService.UpdateOrderStatus_Finish(StoreID, OrderID);
        }

        [HttpPost]
        public JsonResult GetOrderByNFCID(string StoreID, String NFCID)
        {
            return this.Json(orderService.GetOrderByNFCID(StoreID, NFCID));
        }

        [HttpPost]
        public JsonResult GetCustomerOrderInfo(string OrderID)
        {
            return this.Json(orderService.GetCustomerOrderInfo(OrderID));
        }

        [HttpPost]
        public JsonResult GetNotifyOrderCusListByProductID(string StoreID, string ProductID)
        {
            return this.Json(orderService.GetNotifyOrderCusListByProductID(StoreID, ProductID));
        }

        //取得 品項銷售分析資料 (年 月 日)
        [HttpPost]
        public JsonResult GetOrderItemRecordsByDay(string StoreID, DateTime day)
        {
            return this.Json(orderService.GetOrderItemRecordsByDay(StoreID, day));
        }

        [HttpPost]
        public JsonResult GetOrderItemRecordsByMonth(string StoreID, DateTime month)
        {
            return this.Json(orderService.GetOrderItemRecordsByMonth(StoreID, month));
        }

        [HttpPost]
        public JsonResult GetOrderItemRecordsByYear(string StoreID, DateTime year)
        {
            return this.Json(orderService.GetOrderItemRecordsByYear(StoreID, year));
        }

        //取得 業績報表資料 (年 月 日)
        [HttpPost]
        public JsonResult GetOrderSalesRecordsByDay(string StoreID, DateTime day)
        {
            return this.Json(orderService.GetOrderSalesRecordsByDay(StoreID, day));
        }

        [HttpPost]
        public JsonResult GetOrderSalesRecordsByMonth(string StoreID, DateTime month)
        {
            return this.Json(orderService.GetOrderSalesRecordsByMonth(StoreID, month));
        }

        [HttpPost]
        public JsonResult GetOrderSalesRecordsByYear(string StoreID, DateTime year)
        {
            return this.Json(orderService.GetOrderSalesRecordsByYear(StoreID, year));
        }

    }
}