using Sorder_bobo.Models;
using Sorder_bobo.ModelsAdd;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsService
{
    public class ProductService
    {
        SorderDB sorderDB = new SorderDB();

        //ProductGroup
        public List<ProductGroup> GetProductGroups(string StoreID)
        {
            //0顯示 1不顯示(店家在畫面上刪除該備註)
            var pgs = sorderDB.ProductGroup
                     .Where(x => x.StoreID == StoreID && x.ProductGroupDisplayStatus == 0)
                     .ToList();

            List<ProductGroup> PGs = new List<ProductGroup>();

            foreach(var pg in pgs) {
                ProductGroup productGroup = new ProductGroup()
                {
                    ProductGroupID = pg.ProductGroupID,
                    ProductGroupTypeName = pg.ProductGroupTypeName,
                    ProductGroupRemarkStatus = pg.ProductGroupRemarkStatus
                };
                PGs.Add(productGroup);
            }

            return PGs;
        }

        public string AddProductGroupItem(string StoreID, ProductGroup pg)
        {
            string newGuid = Guid.NewGuid().ToString();
            ProductGroup productGroup = new ProductGroup()
            {
                StoreID = StoreID,
                ProductGroupID = newGuid,
                ProductGroupTypeName = pg.ProductGroupTypeName,
                ProductGroupRemarkStatus = pg.ProductGroupRemarkStatus
            };

            sorderDB.ProductGroup.Add(productGroup);
            sorderDB.SaveChanges();

            return newGuid;
        }
        
        public ProductGroup GetProductGroupByProductGroupID(string StoreID, string productGroupID)
        {
            var pg = sorderDB.ProductGroup
                     .Where(x => x.StoreID == StoreID && x.ProductGroupID == productGroupID)
                     .First();

            //覺得很怪，因上面不能直接用first() 然後傳去service 轉json，會直接爆
            //但應該是 抓出來的值 較不單純 (?
            ProductGroup productGroup = new ProductGroup()
            {
                ProductGroupID = pg.ProductGroupID,
                ProductGroupTypeName = pg.ProductGroupTypeName,
                ProductGroupRemarkStatus = pg.ProductGroupRemarkStatus
            };

            return productGroup;
        }

        public void UpdateProductGroupByProductGroupID(string StoreID, ProductGroup productGroup)
        {
            var pg = sorderDB.ProductGroup
                     .Where(x => x.StoreID == StoreID && x.ProductGroupID == productGroup.ProductGroupID)
                     .First();

            pg.ProductGroupTypeName = productGroup.ProductGroupTypeName;
            pg.ProductGroupRemarkStatus = productGroup.ProductGroupRemarkStatus;

            sorderDB.SaveChanges();
        }

        public void DelProductGroupByProductGroupID(string StoreID, string productGroupID)
        {
            //0顯示 1不顯示(店家在畫面上刪除該備註)
            var PG = sorderDB.ProductGroup
                     .Where(x => x.StoreID == StoreID && x.ProductGroupID == productGroupID)
                     .First();
            PG.ProductGroupDisplayStatus = 1;

            //PG下面的 RG和R 也要一併更改成不顯示的狀態
            var RGs = sorderDB.RemarkGroup
                              .Where(x => x.ProductGroupID == productGroupID)
                              .ToList();
            foreach(var RG in RGs) {
                RG.RemarkGroupDisplayStatus = 1;
                var Rs = RG.Remark
                         .Where(x => x.RemarkGroupID == RG.RemarkGroupID)
                         .ToList();
                foreach (var R in Rs)
                {
                    R.RemarkDisplayStatus = 1;
                }
            }
            sorderDB.SaveChanges();
        }

        public string AddRemarkGroupAndRemark(string StoreID, RemarkGroupAndRemarkModel remarkGroupAndRemarkModel)
        {
            string remarkGroupID_newGuid = Guid.NewGuid().ToString();
            RemarkGroup remarkGroup = new RemarkGroup()
            {
               RemarkGroupID = remarkGroupID_newGuid,
               RemarkGroupTypeName = remarkGroupAndRemarkModel.RemarkGroupTypeName,
               RemarkGroupDisplayStatus = 0,
               ProductGroupID = remarkGroupAndRemarkModel.ProductGroupID
            };
            sorderDB.RemarkGroup.Add(remarkGroup);

           var remarkNames = remarkGroupAndRemarkModel.RemarkNames.Trim().Split('/');
            List<Remark> remarks = new List<Remark>();
            for (int i = 0; i < remarkNames.Length; i++) {
                Remark remark = new Remark()
                {
                    RemarkID = Guid.NewGuid().ToString(),
                    RemarkName = remarkNames[i],
                    RemarkGroupID = remarkGroupID_newGuid,
                    RemarkDisplayStatus = 0
                };
                remarks.Add(remark);
            }
            sorderDB.Remark.AddRange(remarks);
            sorderDB.SaveChanges();

            return remarkGroupID_newGuid;
        }

        public void DelRemarkGroupByRemarkGroupID(string StoreID, string remarkGroupID)
        {
            //0顯示 1不顯示(店家在畫面上刪除該備註)
            //備註細項狀態更改
            var remarkGroup = sorderDB.RemarkGroup
                     .Where(x => x.RemarkGroupID == remarkGroupID)
                     .First();
            remarkGroup.RemarkGroupDisplayStatus = 1;

            //備註細項狀態一併更改
            var remarks = sorderDB.Remark
                          .Where(x => x.RemarkGroupID == remarkGroupID)
                          .ToList();
            foreach (var remark in remarks) {
                remark.RemarkDisplayStatus = 1;
            }

            sorderDB.SaveChanges();
        }

        public void DelRemarkDetailByRemarkID(string remarkID)
        {
            //0顯示 1不顯示(店家在畫面上刪除該備註)
            //備註細項狀態更改
            var remark = sorderDB.Remark
                     .Where(x => x.RemarkID == remarkID)
                     .First();
            remark.RemarkDisplayStatus = 1;
            sorderDB.SaveChanges();
        }

        public List<RemarkGroupAndRemarkModel> GetRemarkGroupsAndRemarks(string StoreID)
        {
            //0顯示 1不顯示(店家在畫面上刪除該備註)
            var PG_RG_R_s = sorderDB.ProductGroup
                             .Where(x => x.StoreID == StoreID && x.ProductGroupDisplayStatus == 0)
                             .Select(x=>new {
                                 x.ProductGroupTypeName,
                                 RGs = x.RemarkGroup
                                        .Where(RG =>RG.RemarkGroupDisplayStatus == 0)
                                        .Select(RG => new {
                                              RG.RemarkGroupID,
                                              RG.RemarkGroupTypeName,
                                              remarkNames = RG.Remark
                                                          .Where(R=>R.RemarkDisplayStatus == 0)
                                                          .Select(R=>new {
                                                              R.RemarkName,
                                                          })
                                         })
                             })
                             .ToList();

            List<RemarkGroupAndRemarkModel> result = new List<RemarkGroupAndRemarkModel>();

            foreach (var PG_RG_R in PG_RG_R_s)
            {
                string ProductGroupTypeName = PG_RG_R.ProductGroupTypeName;
                //只需要列下面有Remark的 RG & PG 就好 
                foreach (var RG in PG_RG_R.RGs) {

                    string rNames = "";
                    foreach (var b in RG.remarkNames) {
                        rNames += b.RemarkName+" ";
                    }
                   string newRNames = rNames.Trim().Replace(' ','/');

                    RemarkGroupAndRemarkModel RGandR = new RemarkGroupAndRemarkModel()
                    {
                        ProductGroupTypeName = ProductGroupTypeName,
                        RemarkGroupID = RG.RemarkGroupID,
                        RemarkGroupTypeName = RG.RemarkGroupTypeName,
                        RemarkNames = newRNames
                    };
                    result.Add(RGandR);
                }
            }
            return result;
        }

        public RemarkGroupAndRemarkModel GetRemarkDetailsByRemarkGroupID(string RemarkGroupID) {

            var RGs = sorderDB.RemarkGroup
                   .Where(x => x.RemarkGroupID == RemarkGroupID)
                   .Select(x=>new {
                       x.ProductGroup.ProductGroupTypeName,
                       x.RemarkGroupTypeName,
                       RDetails = x.Remark
                                   .Where(R =>R.RemarkGroupID == RemarkGroupID && R.RemarkDisplayStatus==0)
                                   .Select(R=>new {
                                           R.RemarkID,
                                           R.RemarkName
                                   })
                   })
                   .ToList();

            RemarkGroupAndRemarkModel remarkGroupAndRemarkModel = new RemarkGroupAndRemarkModel();
            foreach (var RG in RGs) {
                List<string> RemarkIDs = new List<string>();
                List<string> RemarkNames = new List<string>();
                foreach (var RDetail in RG.RDetails) {
                    RemarkIDs.Add(RDetail.RemarkID);
                    RemarkNames.Add(RDetail.RemarkName);
                }
              
                remarkGroupAndRemarkModel.ProductGroupTypeName = RG.ProductGroupTypeName;
                remarkGroupAndRemarkModel.RemarkGroupTypeName = RG.RemarkGroupTypeName;
                remarkGroupAndRemarkModel.RemarkNames_list = RemarkNames;
                remarkGroupAndRemarkModel.RemarkIDs_list = RemarkIDs;
            }
            return remarkGroupAndRemarkModel;
        }

        public void AddAndUpdateRemarkDetailsByRemarkGroupID(string StoreID, RemarkGroupAndRemarkModel remarkGroupAndRemarkModel)
        {
            List<Remark> Rs = new List<Remark>();
            for (int i = 0; i < remarkGroupAndRemarkModel.RemarkIDs_list.Count; i++)
            {
                var remarkID = remarkGroupAndRemarkModel.RemarkIDs_list[i];
                var remarkName = remarkGroupAndRemarkModel.RemarkNames_list[i];
                if(remarkID != "")
                {
                    //更新Remark
                    var R = sorderDB.Remark
                             .Where(x => x.RemarkID == remarkID)
                             .First();
                    R.RemarkName = remarkName;
                }
                else {
                    //新增Remark
                    Remark remark = new Remark()
                    {
                        RemarkID = Guid.NewGuid().ToString(),
                        RemarkName = remarkName,
                        RemarkDisplayStatus = 0,
                        RemarkGroupID = remarkGroupAndRemarkModel.RemarkGroupID
                    };
                    Rs.Add(remark);
                }
            }
            sorderDB.Remark.AddRange(Rs);
            sorderDB.SaveChanges();
        }

        


        //Product
        public List<ProductModel> GetProductInfo(string StoreID)
        {
            List<ProductModel> PIMs = new List<ProductModel>();

            var P = sorderDB.Product
                            .Where(x => x.ProductGroup.StoreID == StoreID)
                            .Select(x => new
                            {
                                x.ProductID,
                                x.ProductName,
                                x.ProductImage,
                                x.ProductStatus,
                                x.ProductPrice,
                                x.ProductGroupID,
                                x.ProductGroup.ProductGroupTypeName,
                                x.ProductCreateDateTime
                            })
                           .ToList();

            foreach(var p in P)
            {
                ProductModel productInfoModel = new ProductModel()
                {
                    ProductID = p.ProductID,
                    ProductName = p.ProductName,
                    ProductPrice = p.ProductPrice,
                    ProductImage = p.ProductImage,
                    ProductStatus = p.ProductStatus,
                    ProductGroupID = p.ProductGroupID,
                    ProductGroupName = p.ProductGroupTypeName,
                    ProductCreateDateTime = p.ProductCreateDateTime
                };

                PIMs.Add(productInfoModel);
            }

            return PIMs;
        }
        
        //之前用於下拉選單
        //public List<ProductGroup> GetProductGroup()
        //{
        //    List<ProductGroup> PGs = new List<ProductGroup>();
        //    var PG = sorderDB.ProductGroup
        //                    //.Where(x => x.StoreID == StoreID)
        //                    .Select(x => new
        //                    {
        //                        x.ProductGroupID,
        //                        x.ProductGroupTypeName,
        //                        x.StoreID
        //                    })
        //                   .ToList();
        
        //    foreach (var pg in PG)
        //    {
        //        ProductGroup productInfoModel = new ProductGroup()
        //        {
        //            ProductGroupID = pg.ProductGroupID,
        //            ProductGroupTypeName = pg.ProductGroupTypeName,
        //            StoreID = pg.StoreID
        //        };

        //        PGs.Add(productInfoModel);
        //    }

        //    return PGs;
        //}

        public void DelProductItem(string StoreID, string ProductID)
        {
           var P = sorderDB.Product
                        .Where(x => x.ProductGroup.StoreID == StoreID && x.ProductID == ProductID)
                        .First();

            sorderDB.Product.Remove(P);
            sorderDB.SaveChanges();
        }

        public Product AddProductItem(string StoreID, ProductModel productInfoModel)
        {
            string newGuid = Guid.NewGuid().ToString();
            DateTime nowTime = DateTime.Now;
            Product product = new Product()
            {
                ProductID = newGuid,
                ProductName = productInfoModel.ProductName,
                ProductStatus = 0, //新商品，尚未上架
                ProductImage = productInfoModel.ProductImage,
                ProductPrice = productInfoModel.ProductPrice,
                ProductGroupID = productInfoModel.ProductGroupID,
                ProductCreateDateTime = nowTime
            };
            sorderDB.Product.Add(product);
            sorderDB.SaveChanges();

            return product; 
        }

        public void UpdateProductItem(string StoreID, ProductModel productInfoModel)
        {
            var p = sorderDB.Product
                .Where(x=>x.ProductGroup.StoreID == StoreID && x.ProductID == productInfoModel.ProductID)
                .First();

            p.ProductName = productInfoModel.ProductName;
            p.ProductPrice = productInfoModel.ProductPrice;
            if (productInfoModel.ProductImage != null && productInfoModel.ProductImage !="") {
                p.ProductImage = productInfoModel.ProductImage;
            }
            p.ProductGroupID = productInfoModel.ProductGroupID;

            sorderDB.SaveChanges();
        }

        public void UpdateProductStatus(string StoreID, ProductModel productInfoModel)
        {
            var p = sorderDB.Product
                .Where(x => x.ProductGroup.StoreID == StoreID && x.ProductID == productInfoModel.ProductID)
                .First();

            p.ProductStatus = productInfoModel.ProductStatus;
            sorderDB.SaveChanges();
        }



        



    }
}