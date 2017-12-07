using Sorder_bobo.Models;
using Sorder_bobo.ModelsAdd;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorder_bobo.ModelsService
{
    public class StoreService
    {
        SorderDB sorderDB = new SorderDB();

        //註冊
        //給予一組 uuid
        //save store account password
        public String StoreRegister(Store s)
        {
            //先檢查資料庫中有無相同帳號
           var existAccount = sorderDB.Store
                                      .Where(x => x.StoreAccount == s.StoreAccount)
                                      .ToList();

            if (existAccount.Count != 0) {
                return null; //會拋到前端的error
               // throw new Exception("帳號已重複!");
            }

            string storeID = Guid.NewGuid().ToString();
            Store store = new Store()
            {
                StoreID = storeID,
                StoreKeeper = s.StoreKeeper,
                StorePhone = s.StorePhone,
                StoreAccount = s.StoreAccount,
                StorePassword = s.StorePassword,
                Unit = "10",
                OrderQuantity = 5,
                IntervalTime =10
            };
            sorderDB.Store.Add(store);
            sorderDB.SaveChanges();

            return storeID;
        }
        
        public String StoreLogin(Store s)
        {
            try{
                var existAccount = sorderDB.Store
                                 .Where(x => x.StoreAccount == s.StoreAccount)
                                 .First();

                if (existAccount.StoreAccount == s.StoreAccount && existAccount.StorePassword == s.StorePassword)
                {
                    return existAccount.StoreID;
                }

                //要用null 才會拋到前端的error
                // return "登入失敗!";
                return null;
            }
            catch (Exception) {
                //  return "此帳號不存在!";
                return null;
            }
           
        }



        public Store GetStoreInfo(string StoreID)
        {
            var s = sorderDB.Store
                        .Where(x => x.StoreID == StoreID)
                        .First();

            Store store = new Store()
            {
               StoreID = s.StoreID,
               StoreImage = s.StoreImage,
               StoreKeeper = s.StoreKeeper,
               StoreName =  s.StoreName,
               StorePhone =  s.StorePhone,
               Address =  s.Address,
               StoreInformation = s.StoreInformation,  //storeIntroduction
               StoreAccount = s.StoreAccount
            };

            return store;
        }

        public List<BusinessHours> GetBusinessTimes(string StoreID)
        {
            var bhs = sorderDB.BusinessHours
                        .Where(x => x.StoreID == StoreID)
                        .OrderBy(x => x.Week)
                        .ToList();

            //上面撈出來，卻不能直接傳到service轉json，很怪 (待確認)
            //初判 是 上面撈出的data較不單純(關連到其他table)
            List<BusinessHours> BHs = new List<BusinessHours>();

            foreach (var bh in bhs)
            {
                BusinessHours businessHours = new BusinessHours()
                {
                    Week = bh.Week,
                    StartTime = bh.StartTime,
                    EndTime = bh.EndTime
                };
                BHs.Add(businessHours);
            }

            return BHs;
        }


        public Store GetWaitTime(string StoreID) {

           var s = sorderDB.Store
                       .Where(x => x.StoreID == StoreID)
                       .First();

            Store store = new Store()
            {
                Unit = s.Unit,
                OrderQuantity = s.OrderQuantity,
                IntervalTime = s.IntervalTime
            };

            return store;
        }


        public bool UpdateStorePassword(string StoreID, string StoreOldPassword, string StoreNewPassword)
        {
            var S = sorderDB.Store
                 .Where(x => x.StoreID == StoreID)
                 .First();

            if (S.StorePassword == StoreOldPassword)
            {
                S.StorePassword = StoreNewPassword;
                sorderDB.SaveChanges();
                return true;
            }
            else {
                return false;
            }
        }



        public void UpdateStoreInfo(Store store)
        {
            var S = sorderDB.Store
                        .Where(x => x.StoreID == store.StoreID)
                        .First();

            S.StoreName = store.StoreName;
            S.StorePhone = store.StorePhone;

            if (store.StoreImage != null) {
                S.StoreImage = store.StoreImage;
            }
           
            S.StoreKeeper = store.StoreKeeper;
            S.Address = store.Address;
            S.StoreInformation = store.StoreInformation;

            sorderDB.SaveChanges();
        }


        public void UpdateWaitTime(Store store) {
            var S = sorderDB.Store
                    .Where(x => x.StoreID == store.StoreID)
                    .First();

            S.Unit = store.Unit;
            S.OrderQuantity = store.OrderQuantity;
            S.IntervalTime = store.IntervalTime;

            sorderDB.SaveChanges();
        }
        
        public void UpdateBusinessTime(string StoreID, BusinessHoursModel businessHoursModel)
        {
            var busHour = sorderDB.BusinessHours
                    .Where(x => x.StoreID == StoreID);
            sorderDB.BusinessHours.RemoveRange(busHour);

            List<BusinessHours> BHs = new List<BusinessHours>();

            for (int i = 0; i < businessHoursModel.Weeks.Length; i++) {
                BusinessHours bh = new BusinessHours()
                {
                    BusinessHoursID = Guid.NewGuid().ToString(),
                    StoreID = StoreID,
                    Week = businessHoursModel.Weeks[i],
                    StartTime = TimeSpan.Parse(businessHoursModel.StartTimes[i]),
                    EndTime = TimeSpan.Parse(businessHoursModel.ClosedTimes[i])
                };
                BHs.Add(bh);
            }
            sorderDB.BusinessHours.AddRange(BHs);
            sorderDB.SaveChanges();
        }

     

        

    }
}