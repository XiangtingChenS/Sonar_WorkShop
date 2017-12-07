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
    public class ProductController : Controller
    {
        ProductService productService = new ProductService();

        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetProductInfo(string StoreID)
        {
            return this.Json(productService.GetProductInfo(StoreID));
        }


        //下拉選單用
        //[HttpPost]
        //public JsonResult GetProductGroup()
        //{
        //    //viewBag allProductGroup ???  忘記了
        //    return this.Json(productService.GetProductGroup());
        //}

        [HttpPost]
        public void DelProductItem(string StoreID,string ProductID) {

            productService.DelProductItem(StoreID, ProductID);
        }

        [HttpPost]
        public JsonResult AddProductItem(string StoreID, ProductModel productInfoModels)
        {
            return this.Json(productService.AddProductItem(StoreID, productInfoModels));
        }

        [HttpPost]
        public void UpdateProductItem(string StoreID, ProductModel productInfoModels)
        {
            productService.UpdateProductItem(StoreID, productInfoModels);
        }

        [HttpPost]
        public void UpdateProductStatus(string StoreID, ProductModel productInfoModels)
        {
            productService.UpdateProductStatus(StoreID, productInfoModels);
        }



        //ProductGroup
        [HttpPost]
        public string AddProductGroupItem(string StoreID, ProductGroup productGroup)
        {
            return productService.AddProductGroupItem(StoreID, productGroup);
        }

        [HttpPost]
        public JsonResult GetProductGroupByProductGroupID(string StoreID, string productGroupID)
        {
            return this.Json(productService.GetProductGroupByProductGroupID(StoreID, productGroupID));
        }

        [HttpPost]
        public void UpdateProductGroupByProductGroupID(string StoreID, ProductGroup productGroup)
        {
            productService.UpdateProductGroupByProductGroupID(StoreID, productGroup);
        }

        [HttpPost]
        public void DelProductGroupByProductGroupID(string StoreID, string productGroupID)
        {
            productService.DelProductGroupByProductGroupID(StoreID, productGroupID);
        }

        [HttpPost]
        public JsonResult GetProductGroups(string StoreID)
        {
            return this.Json(productService.GetProductGroups(StoreID));
        }

        [HttpPost]
        public string AddRemarkGroupAndRemark(string StoreID, RemarkGroupAndRemarkModel remarkGroupAndRemarkModel)
        {
            //回傳RemarkGroupID
            return productService.AddRemarkGroupAndRemark(StoreID, remarkGroupAndRemarkModel);
        }
        
        [HttpPost]
        public void DelRemarkGroupByRemarkGroupID(string StoreID, string remarkGroupID)
        {
            productService.DelRemarkGroupByRemarkGroupID(StoreID, remarkGroupID);
        }

        [HttpPost]
        public JsonResult GetRemarkGroupsAndRemarks(string StoreID)
        {
            return this.Json(productService.GetRemarkGroupsAndRemarks(StoreID));
        }

        [HttpPost]
        public JsonResult GetRemarkDetailsByRemarkGroupID(string RemarkGroupID)
        {
            return this.Json(productService.GetRemarkDetailsByRemarkGroupID(RemarkGroupID));
        }

        [HttpPost]
        public void DelRemarkDetailByRemarkID(string RemarkID)
        {
            productService.DelRemarkDetailByRemarkID(RemarkID);
        }
        
        [HttpPost]
        public void AddAndUpdateRemarkDetailsByRemarkGroupID(string RemarkGroupID, RemarkGroupAndRemarkModel remarkGroupAndRemarkModel)
        {
            productService.AddAndUpdateRemarkDetailsByRemarkGroupID(RemarkGroupID, remarkGroupAndRemarkModel);
        }



    }
}