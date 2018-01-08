    //撈新訂單  之後要每秒發一次
    var lastestOrderTime;
    var cookie;
    $(document).ready(function () {
        cookie = checkAndGetCookie();
          $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetNewOrders")',
            data: {
                StoreID: cookie
            },
            success: function (response) {
                if (response.length != 0) {
                    genNewOrderBlock(response);
                    //因有照時間排序，故取最後一筆即可
                    lastestOrderTime = response[response.length - 1].OrderDateTime;
                } else {
                    lastestOrderTime = new Date();
                }
                setInterval(getLatestOrders, 2000)
            },
            error: function () { console.log("Error_GetNewOrders"); }
        });

     //撈狀態1的
     $.ajax({
        type: 'post',
        url: '@Url.Action("../Order/GetProcessingOrders")',
        data: {
            StoreID: cookie
        },
        success: function (response) {

            for (var i = 0; i < response.length; i++) {

                //三的倍數 要做分割區塊
                 var partitionPage = document.createElement("div");
                 partitionPage.setAttribute("class", "row partitionPage");
                if (i % 3 == 0) {
                   partitionPage = genMainToggleActiveContainerAndLiTag(partitionPage);
                }

                var existOrderInfo = genExistOrderInfoBlock(response[i], i);
                partitionPage.appendChild(existOrderInfo);
            }

            //不滿三個，補空的訂單小區塊，因未滿三個 訂單會滿版
            fillEmptyOrderDiv(response.length);

            $(processingOrder_container).find(".mainToggleActiveContainer").first().addClass("active");
            $("#processingOrder_wheel").find("li").first().addClass("active");

        },
        error: function () { console.log("Error_GetProcessingOrders"); }
    });
    });


    function getLatestOrders() {

        if (lastestOrderTime instanceof Date == false) {
            var milli = lastestOrderTime.replace(/\/Date\((-?\d+)\)\//, '$1');
            lastestOrderTime = new Date(parseInt(milli));
        }

        getNewOrdersByLastestOrderTime();

        removeCanceledStatusOrdersDiv();
    }

    function removeNewOrderMomentClass(orderID) {
        $("#" + orderID).removeClass("newOrderLoad");
    }

    function getNewOrdersByLastestOrderTime() {
        $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetNewOrdersByLastestOrderTime")',
            data: {
                StoreID: cookie,
                LastestOrderTime: lastestOrderTime.toISOString()
            },
            success: function (response) {
                if (response.length != 0) {
                    lastestOrderTime = response[response.length - 1].OrderDateTime;
                }
                //因有照時間排序，故取最後一筆即可
                for (var i = 0; i < response.length; i++) {
                    var newOrderHtml = '<div id="' + response[i].OrderID +
                        '" class="newOrder newOrderLoad" style="width: 10%; text-align: center;">新訂單（' +
                        timefillZero(response[i].OrderTime.Hours) + ":" + timefillZero(response[i].OrderTime.Minutes) + '）</div>';
                    $("#newOrders_div").append(newOrderHtml);
                    //  $(newOrderHtml).insertAfter(".newOrder:last");

                    var orderID = response[i].OrderID;
                    setTimeout(removeNewOrderMomentClass, 3000, orderID);
                }
            },
            error: function () {
                console.log("Error_GetNewOrdersByLastestOrderTime");
               // console.log("Error_GetNewOrdersByLastestOrderTime");
            }
         });
    }

    function removeCanceledStatusOrdersDiv() {
        $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetCanceledStatusOrders")',
            data: {
                StoreID: cookie
            },
            success: function (orderIDs) {
                for (var i = 0; i < orderIDs.length; i++) {
                    var $element = $("#" + orderIDs[i]);
                    if ($element.length == 1) {
                        $element.remove();
                    }
                }
            },
            error: function () { console.log("Error_removeCanceledStatusOrdersDiv"); }
         });

    }



     function genNewOrderBlock(data) {
         var newOrders_div = document.getElementById("newOrders_div");
         for (var i = 0; i < data.length; i++) {
             var div = document.createElement("div");
             div.setAttribute("id", data[i].OrderID);
             div.setAttribute("class", "newOrder");
             div.style.width = "10%";
             div.style.textAlign = "center";
             var text = document.createTextNode("新訂單（" + timefillZero(data[i].OrderTime.Hours) + ":" + timefillZero(data[i].OrderTime.Minutes) +"）");
             div.appendChild(text);
             newOrders_div.appendChild(div);
         }

     }



     function genProcessingOrderContent(data) {
         var content = document.createElement("div");
         content.setAttribute("class", "card text-center");
         //header
         var header = document.createElement("div");
         header.setAttribute("class", "card-header");
         var nfcTitle = document.createTextNode("NFC編號：");
         header.appendChild(nfcTitle);

         var nfcSpan = document.createElement("span");
         var nfcID = document.createTextNode(data.NFCID);
         nfcSpan.appendChild(nfcID);
         header.appendChild(nfcSpan);

         content.appendChild(header);

         var detailForContent = document.createElement("div");
         detailForContent.setAttribute("class", "card-block");

         var productGroups_json = data.productGroupModelsByOrderDetail;
         var productGroups_array = Object.keys(productGroups_json);

         //產生訂單明細內容之表格
         for (var i = 0; i < productGroups_array.length; i++) {
             var key = productGroups_array[i];
             var ProductGroupValues = productGroups_json[key];

             var PGR_Status = ProductGroupValues.ProductGroupRemarkStatus;
             var table;
             if (PGR_Status == 0) {
                 //明細備註
                 table = genRemarkDetailTable(ProductGroupValues);
             } else if (PGR_Status == 1) {
                 // 大備註
                 table = genRemarkGroupTable(ProductGroupValues);
             }

             detailForContent.appendChild(table);
         }

         $(detailForContent).append('<div style="text-align:left;"><label style="text-align:left;">客戶需求</label><div style="text-align: center; color:red;">' + data.OrderRemark + '</div></div >')

         content.appendChild(detailForContent);


         return content;
     }


     function genRemarkDetailTable(data) {
         var table = document.createElement("table");
         table.setAttribute("class", "table table-sm table-bordered");

         var caption = document.createElement("caption");
         caption.style.textAlign = "left";
         var textForCaption = document.createTextNode(data.ProductGroupTypeName);
         caption.appendChild(textForCaption);

         table.appendChild(caption);
         $(table).append('<thead><tr><th>品項</th><th>數量</th><th>備註</th></tr></thead>');

         var tbody = document.createElement("tbody");
         for (var i = 0; i < data.orderDetails.length; i++) {
             var orderDetail = data.orderDetails[i];

             //var remarkString = "";
             //for (var j = 0; j < orderDetail.Remark.length; j++) {
             //    remarkString += orderDetail.Remark[j] + " ";
             //}
             $(tbody).append('<tr><td>' + orderDetail.ProductName + '</td ><td>' + orderDetail.Quantity + '</td><td>' + orderDetail.Remark +'</td></tr >');
         }

         table.appendChild(tbody);
         return table;
     }

     function genRemarkGroupTable(data) {
         var table = document.createElement("table");
         table.setAttribute("class", "table table-sm table-bordered");

         var caption = document.createElement("caption");
         caption.style.textAlign = "left";
         var textForCaption = document.createTextNode(data.ProductGroupTypeName);
         caption.appendChild(textForCaption);

         table.appendChild(caption);
         $(table).append('<thead><tr><th>品項</th><th>數量</th></tr></thead>');

         var tbody = document.createElement("tbody");
         for (var i = 0; i < data.orderDetails.length; i++) {
             var orderDetail = data.orderDetails[i];
             $(tbody).append('<tr><td>' + orderDetail.ProductName + '</td ><td>' + orderDetail.Quantity + '</td></tr >');
         }
         table.appendChild(tbody);
         $(table).append('<tfoot><tr><td colspan="2">' + data.orderDetails[0].Remark + '</td></tr ></tfoot >');

         return table;

     }


     function orderFinishAction(_this) {
         var orderID = $(_this).attr("orderid");

         if (confirm('該筆訂單確定已完成?')) {
             //將訂單狀態改成 "未取貨"
             $.ajax({
                 type: 'post',
                 url: '@Url.Action("../Order/UpdateOrderStatus_Finish")',
                 data: {
                     StoreID: cookie,
                     OrderID: orderID
                 },
                 success: function (response) {
                     changePageForFinishBtn(_this);
                 },
                 error: function () { console.log("Error_orderFinishAction"); }
             });
         }
         $("#serachOrderBar").focus();
     }

     function changePageForFinishBtn(_this) {
         var orderIndex = parseInt($(_this).attr("index"));

         //將所有空白區塊移除
         $(".emptyOrderInfo").remove();

         //計算 this element 屬於哪個 partitionPage(一頁三個區塊，故除以三，並取整數)
         var positionNumber = Math.floor(orderIndex / 3);

         //將this element 以後的 existOrderInfo 向前移
         for (var i = orderIndex + 1; i < $(".existOrderInfo").length; i++) {
             var partitionPage = $(".partitionPage")[positionNumber];
             partitionPage.insertBefore($(".existOrderInfo")[i], partitionPage.childNodes[i]);

             //重設完成按鈕的index
             $($(".orderFinishBtn")[i]).attr("index", i - 1);

             //變成在下一頁放置元素
             if (i % 3 == 0) {
                 positionNumber++;
             }
         }

         //最後才刪除點選 this element 的訂單
         $("#processingOrder_container").find(".existOrderInfo")[orderIndex].remove();

         //把多餘的partitionPage & li 刪掉
         for (var j = $(".partitionPage").length - 1; j >= 0; j--) {
             if ($($(".partitionPage")[j]).children().length == 0) {

                 if ($($(".mainToggleActiveContainer")[j]).hasClass("active")) {
                     $($(".mainToggleActiveContainer")[j - 1]).addClass("active");
                     $($("#processingOrder_wheel").find("li")[j - 1]).addClass("active");
                 }
                 $(".mainToggleActiveContainer")[j].remove();
                 $("#processingOrder_wheel").find("li")[j].remove();
             }
         }

         //partitionPage單頁element不滿3的倍數，補滿 emptyOrderInfo
         fillEmptyOrderDiv($(".existOrderInfo").length);
     }

     //不滿三個，補空的訂單小區塊，因未滿三個 訂單會滿版
     function fillEmptyOrderDiv(existOrderLength) {
         var remainder = existOrderLength % 3;
         if (remainder != 0) {
             var targetBlock = $("#processingOrder_container").find(".partitionPage").last();
             for (var i = 0; i < (3 - remainder); i++) {
                 targetBlock.append('<div class="doingOrder col emptyOrderInfo" style="left:1%" ></div>');
             }
         }

     }


     function searchOrderAction(event) {

         if (event.keyCode == 13) {
            var currentNfcID = $("#serachOrderBar").val();
            $("#serachOrderBar").val("");

             //(nfcid 在資料庫都查不到 ) - >  0 綁定新訂單 +插入處理中的第一筆 +顯示於右邊
             //有查到  顯示於右邊
             //皆是回傳這筆order content

             $.ajax({
                 type: 'post',
                 url: '@Url.Action("../Order/GetOrderByNFCID")',
                 data: {
                     StoreID: cookie,
                     NFCID: currentNfcID
                 },
                 success: function (response) {

                     if ($("#" + response.OrderID).length!= 0 ) {
                         $("#" + response.OrderID).remove();
                         response.Status--;

                         //將新綁定NFC的訂單 放置正在處理中的區塊
                         //將所有空白區塊移除
                         $(".emptyOrderInfo").remove();
                         //取得現在 existOrderInfo 的total數量(不需要+1，因物件從0開始) 看是否需要建 partitionPage
                         var currentIndex = $(".existOrderInfo").length;
                         var partitionPage = document.createElement("div");
						     partitionPage.setAttribute("class", "row partitionPage");
                         if (currentIndex % 3 == 0) {
                             partitionPage = genMainToggleActiveContainerAndLiTag(partitionPage);
                         }

                         var existOrderInfo = genExistOrderInfoBlock(response, currentIndex);
                         if (partitionPage) {
                             partitionPage.appendChild(existOrderInfo);
                              //若一開始任何partitionPage都沒有，要加active的class
                             //且長度要扣掉剛剛已創立的
                             var mainToggleActiveContainer = $("#processingOrder_container").find(".mainToggleActiveContainer");
                             if (mainToggleActiveContainer.length-1 == 0) {
                                 mainToggleActiveContainer.first().addClass("active");
                                 $("#processingOrder_wheel").find("li").first().addClass("active");
                             }
                         } else {
                           //抓最後一個 existOrderInfo的位置， 將現在的訂單放在他後面

                             var orderIndex = $(".existOrderInfo").length;
                             //計算 this element 屬於哪個 partitionPage(一頁三個區塊，故除以三，並取整數)
                             var positionNumber = Math.floor(orderIndex / 3);

                             $($(".mainToggleActiveContainer")[positionNumber]).find(".partitionPage").append(existOrderInfo);
                         }

                         //不滿三個，補空的訂單小區塊，因未滿三個 訂單會滿版
                         currentIndex = $(".existOrderInfo").length;
                         fillEmptyOrderDiv(currentIndex);
                     }

                     //查詢專區
                     $("#searchOrder_container").children().remove();

                     var content = genProcessingOrderContent(response);
                     var statusData = statusConvertToTextAndColor(response.Status);
                     $(content).append('<div class="card-footer text-muted" style="color:black !important;background:' + statusData.color + '" >' + statusData.text + '</div>');
                     $("#searchOrder_container").append(content);




                    // changePageForFinishBtn(_this);
                 },
                 error: function () { console.log("目前無新訂單，無法綁定!"); }
             });
         }
     }

     function statusConvertToTextAndColor(status) {

         if (status == 0) {
             return { "text": "新訂單已綁定", "color":"#80dfff"};
         }

         if (status == 1) {
             return { "text": "訂單處理中", "color": "#ff9999" };
         }

         if (status == 2) {
             return { "text": "訂單已完成，待取貨", "color": "#99e699" }; ;
         }
     }

     function genMainToggleActiveContainerAndLiTag(partitionPage) {
         var div1 = document.createElement("div");
         div1.setAttribute("class", "carousel-item mainToggleActiveContainer"); //active
         var div2 = document.createElement("div");
         div2.setAttribute("class", "carousel-caption d-block row");
        


         div2.appendChild(partitionPage);
         div1.appendChild(div2);
         $("#processingOrder_container").append(div1);

         //開一個li
         var wheel_number = $("#processingOrder_wheel").find("li").length;
         $("#processingOrder_wheel").append(' <li data-target="#carouselExampleIndicators" data-slide-to="' + wheel_number + '"></li>');

     }


     function genExistOrderInfoBlock(data, index) {
         var existOrderInfo = document.createElement("div");
         existOrderInfo.setAttribute("class", "doingOrder col existOrderInfo");
         existOrderInfo.style.left = '1%';

         var content = genProcessingOrderContent(data);
         $(content).append('<div class="card-footer text-muted" ><button class="btn btn-success orderFinishBtn" orderID="' + data.OrderID + '" index=' + index + ' onclick="orderFinishAction(this)">完成</button ></div>');
         existOrderInfo.appendChild(content);

         return existOrderInfo;
     }
