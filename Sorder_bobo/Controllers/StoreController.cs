using Sorder_bobo.Models;
using Sorder_bobo.ModelsAdd;
using Sorder_bobo.ModelsService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Sorder_bobo.Controllers
{
    public class StoreController : Controller
    {
        StoreService storeService = new StoreService();
        ProductService productService = new ProductService();

        public ActionResult Login()
        {
            return View();
        }

        // GET: Store
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MyMenu()
        {
          //  ViewBag.allProductGroup = productService.GetProductGroup().ToArray();
            return View();
        }

        public ActionResult OrderHistory()
        {
            return View();
        }

        public ActionResult OrderSalesRecord()
        {
            return View();
        }

        public ActionResult OrderItemRecord()
        {
            return View();
        }


        public ActionResult TodayOrder()
        {
            return View();
        }

        public ActionResult MyInfo()
        {
            return View();
        }

        public ActionResult CheckOut()
        {
            return View();
        }

        

        [HttpPost]
        public JsonResult StoreRegister(Store store)
        {
            return this.Json(storeService.StoreRegister(store));
        }

        [HttpPost]
        public JsonResult StoreLogin(Store store)
        {
            return this.Json(storeService.StoreLogin(store));
        }

        //get load page
        [HttpPost]
        public JsonResult GetStoreInfo(string StoreID)
        {
            return this.Json(storeService.GetStoreInfo(StoreID));
        }

        [HttpPost]
        public JsonResult GetBusinessTimes(string StoreID)
        {
            return this.Json(storeService.GetBusinessTimes(StoreID));
        }


        [HttpPost]
        public JsonResult GetWaitTime(string StoreID)
        {
            return this.Json(storeService.GetWaitTime(StoreID));
        }





        //---end load page -------

        [HttpPost]
        public bool UpdateStorePassword(string StoreID, string StoreOldPassword, string StoreNewPassword)
        {
           return storeService.UpdateStorePassword(StoreID, StoreOldPassword, StoreNewPassword);
        }

        [HttpPost]
        public void UpdateStoreInfo(Store store)
        {
            storeService.UpdateStoreInfo(store);
        }

        [HttpPost]
        public void UpdateWaitTime(Store store)
        {
            storeService.UpdateWaitTime(store);
        }

        [HttpPost]
        public void UpdateBusinessTime(string StoreID, BusinessHoursModel businessHoursModel)
        {
            storeService.UpdateBusinessTime(StoreID, businessHoursModel);
        }

    }
}