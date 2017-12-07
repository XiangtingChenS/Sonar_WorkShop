 //我的菜單 - 所有產品
    $.ajax({
        type: 'post',
        url: '@Url.Action("../Product/GetProductInfo")',
        data: {
            StoreID : 'S1'
        },
        success: function (result) {
          //  myMenuGenerateItem(productID, productImage, productName, ProductPrice, ProductGroupName, productStatus)
            for (var i = 0; i < result.length; i++)
            {
                myMenuGenerateItem(result[i]);
            }

            console.log(result);
        },
        error: function () { alert("Error"); }
    });

     //我的菜單 - 產品群組下拉選單
    var productGroupSelect;
    $.ajax({
        async:false,
        type: 'post',
        url: '@Url.Action("../Product/GetProductGroup")',
        data: {
            StoreID : 'S1'
        },
        success: function (result) {
        
            productGroupSelect = document.createElement("select");
            for (var i = 0; i < result.length; i++)
            {
                var option = document.createElement("option")
                option.setAttribute("value", result[i].ProductGroupID);
                var text = document.createTextNode(result[i].ProductGroupName);
                option.appendChild(text);
                productGroupSelect.appendChild(option);
            }
        },
        error: function () { alert("Error"); }
    });

	   $(document).ready(function () {
        console.log(productGroupSelect);
    });
	
	 function myMenuEdit(btn) {
            $(btn).toggleClass('hide', true);
            $(btn).siblings(".myMenuAddItem").toggleClass('hide', false);
            $(btn).siblings(".myMenuEditFinish").toggleClass('hide', false);

             //unlock all obj
            $(".uploadFile").toggleClass('hide', false);
            $(".oversell").prop('disabled', false);
            $(".purchased").prop('disabled', false);
            $(".notifyCus").prop('disabled', false);
            $(".offShelf").prop('disabled', false);
            $(".onShelf").prop('disabled', false);


            $(".productNameText").toggleClass('hide', true);
            $(".productNameEdit").toggleClass('hide', false);

            $(".productPriceText").toggleClass('hide', true);
            $(".productPriceEdit").toggleClass('hide', false);

            for (var i = 0; i < $(".productNameText").length; i++) {
                $(".productNameEdit")[i].value = $(".productNameText")[i].innerText;
                $(".productPriceEdit")[i].value = $(".productPriceText")[i].innerText;
            }
        }

        function myMenuGenerateItem(data) {
            if (!data) {
                data = {
                    "ProductID" : '', "ProductImage" :'', "ProductName" :'',
                    "ProductPrice":'', "ProductGroupID ":'', "ProductGroupName":'',
                    "ProductStatus":'0'
                };
            }

            // dom  table
            var tr = document.createElement("tr");
            tr.setAttribute("productID", data.ProductID);

            var td1_image = document.createElement("td");
            var td2_name = document.createElement("td");
            var td3_price = document.createElement("td");
            var td4_group = document.createElement("td");
            var td5_currentStatus = document.createElement("td");
            var td6_toggleStatusBtn = document.createElement("td");


            var isNewProductItem = { "fileInput": "", "productText": "hide", "productEdit": "" };
            if (data.ProductID != '') {
                //init old product item
                isNewProductItem = { "fileInput": "hide", "productText": "", "productEdit": "hide" };
            }
            //td1_image

            //if productImage!- ''  create img
            var fileInput = document.createElement("input");
            fileInput.setAttribute("class", "uploadFile " + isNewProductItem.fileInput);
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("accept", "image/*");
            fileInput.addEventListener("change", function () {
                uploadProductImage(this, data.ProductImage);
            });
            td1_image.appendChild(fileInput);

            //td2_name
            var p_productName = document.createElement("span");
            p_productName.setAttribute("class", "productNameText " + isNewProductItem.productText);
            var pText = document.createTextNode(data.ProductName);
            var productNameTextInput = document.createElement("input");
            productNameTextInput.setAttribute("class", "productNameEdit " + isNewProductItem.productEdit);
            productNameTextInput.setAttribute("type", "text");
            p_productName.appendChild(pText);
            td2_name.appendChild(p_productName);
            td2_name.appendChild(productNameTextInput);

            //td3_price
            var p_productPrice = document.createElement("span");
            p_productPrice.setAttribute("class", "productPriceText " + isNewProductItem.productText);
            var pText = document.createTextNode(data.ProductPrice);
            var productPriceTextInput = document.createElement("input");
            productPriceTextInput.setAttribute("class", "productPriceEdit " + isNewProductItem.productEdit);
            productPriceTextInput.setAttribute("type", "number");
            p_productPrice.appendChild(pText);
            td3_price.appendChild(p_productPrice);
            td3_price.appendChild(productPriceTextInput);

            //td4_group
            var p_productGroup = document.createElement("span");
            p_productGroup.setAttribute("class", "productGroupText " + isNewProductItem.productText);
            var pText = document.createTextNode(data.ProductGroupName);
            var productGroupSelect = document.createElement("select");

            // productGroupSelect.setAttribute("class", "productGroup " + isNewProductItem.productEdit);
            p_productGroup.appendChild(pText);
            td4_group.appendChild(p_productGroup);
            td4_group.appendChild(productGroupSelect);





            var allBtnStatus = StatusConverToText(data.ProductStatus);
            //td5_currentStatus
            var currentStatus = document.createElement("span");
            currentStatus.setAttribute("class", "currentStatus");
            currentStatus.setAttribute("productStatus", data.ProductStatus);
            var pText = document.createTextNode(allBtnStatus.statusName);
            currentStatus.appendChild(pText);
            td5_currentStatus.appendChild(currentStatus);

            //td6_toggleStatusBtn
            //已售完
            var oversellBtn = document.createElement("button");
            oversellBtn.setAttribute("class", "btn btn-info oversell " + allBtnStatus.oversell);
            var oversellBtn_Text = document.createTextNode("已售完");
            oversellBtn.appendChild(oversellBtn_Text);
            oversellBtn.addEventListener("click", function () {
                oversellBtnFunc(this);
            });
            td6_toggleStatusBtn.appendChild(oversellBtn);

            //已進貨
            var purchasedBtn = document.createElement("button");
            purchasedBtn.setAttribute("class", "btn btn-info purchased " + allBtnStatus.threeGroup);
            var purchasedBtn_Text = document.createTextNode("已進貨");
            purchasedBtn.appendChild(purchasedBtn_Text);
            purchasedBtn.addEventListener("click", function () {
                purchasedBtnFunc(this);
            });
            td6_toggleStatusBtn.appendChild(purchasedBtn);

            //通知已下單顧客
            var notifyCus = document.createElement("button");
            notifyCus.setAttribute("class", "btn btn-warning notifyCus " + allBtnStatus.threeGroup);
            notifyCus.setAttribute("data-toggle", "modal");
            notifyCus.setAttribute("data-target", "#searchOrders");
            var oversellBtn_Text = document.createTextNode("通知已下單顧客");
            notifyCus.appendChild(oversellBtn_Text);
            td6_toggleStatusBtn.appendChild(notifyCus);

            //下架
            var offShelfBtn = document.createElement("button");
            offShelfBtn.setAttribute("class", "btn btn-danger offShelf " + allBtnStatus.threeGroup);
            var offShelfBtn_Text = document.createTextNode("下架");
            offShelfBtn.appendChild(offShelfBtn_Text);
            offShelfBtn.addEventListener("click", function () {
                offShelfBtnFunc(this);
            });
            td6_toggleStatusBtn.appendChild(offShelfBtn);

            var onShelfBtn = document.createElement("button");
            onShelfBtn.setAttribute("class", "btn btn-danger onShelf " + allBtnStatus.onSelf);
            var onShelfBtn_Text = document.createTextNode("上架");
            onShelfBtn.appendChild(onShelfBtn_Text);
            onShelfBtn.addEventListener("click", function () {
                onShelfBtnFunc(this);
            });
            td6_toggleStatusBtn.appendChild(onShelfBtn);



            //var productDelBtn = document.createElement("button");
            //productDelBtn.setAttribute("class", "fa fa-trash productDelBtn");
            //productDelBtn.addEventListener("click", function () {
            //    delProductColumn(this);
            //});
            //td5.appendChild(productDelBtn);

            tr.appendChild(td1_image);
            tr.appendChild(td2_name);
            tr.appendChild(td3_price);
            tr.appendChild(td4_group);
            tr.appendChild(td5_currentStatus);
            tr.appendChild(td6_toggleStatusBtn);
            $("#myMenuTbody").prepend(tr);


            if (data.ProductID != '')
            {
                myMenuLockAllObj();
            }

        }

        function myMenuEditFinish(btn) {
            $(btn).toggleClass('hide', true);
            $(btn).siblings(".myMenuAddItem").toggleClass('hide', true);
            $(btn).siblings(".myMenuEdit").toggleClass('hide', false);

            for (var i = 0; i < $(".productNameText").length; i++) {
                $(".productNameText")[i].innerText = $(".productNameEdit")[i].value;
                $(".productPriceText")[i].innerText = $(".productPriceEdit")[i].value;

            }

            //鎖住全部的物件
            myMenuLockAllObj();

            //刪除沒有資料的表格
            removeEmptyDataTr();

            //儲存變更後的欄位
            myMenuSave();
        }

        function removeEmptyDataTr() {
            //會再增加判斷兩個欄位 ? 金額 和 群組
            var uploadFile = $(".uploadFile");
            var productNameEdit = $(".productNameEdit");
            for (var i = $(".uploadFile").length - 1; i >= 0; i--) {
                if (uploadFile[i].value == "" && productNameEdit[i].value == "") {
                    uploadFile[i].closest("tr").remove();
                }
            }
        }

        function myMenuSave() {
            var myMenuTr = $("#myMenuTbody tr");
            for (var i = 0; i < myMenuTr.length; i++) {
                var myMenuTd = $(myMenuTr[i]).find("td");
               // console.log(myMenuTd);
            }
        }

        function myMenuLockAllObj() {
            $(".uploadFile").toggleClass('hide', true);
            $(".oversell").prop('disabled', true);
            $(".purchased").prop('disabled', true);
            $(".notifyCus").prop('disabled', true);
            $(".offShelf").prop('disabled', true);
            $(".onShelf").prop('disabled', true);

            $(".productNameText").toggleClass('hide', false);
            $(".productNameEdit").toggleClass('hide', true);

            $(".productPriceText").toggleClass('hide', false);
            $(".productPriceEdit").toggleClass('hide', true);
        }


        function uploadProductImage(uploadFile) {

            var file = uploadFile.files[0];

            if (file) {
                var FR = new FileReader();

                FR.addEventListener("load", function (e) {
                    uploadFile.setAttribute("value", e.target.result)
                    var img = document.createElement("img");
                    img.src = e.target.result;
                    $(uploadFile).closest("td").prepend(img);
                });

                FR.readAsDataURL(file);
            }
        }

        function oversellBtnFunc(btn) {
            $(btn).closest("tr").find(".currentStatus").html("已售完");
            $(btn).toggleClass('hide',true);
            $(btn).siblings(".purchased").toggleClass('hide', false);
            $(btn).siblings(".notifyCus").toggleClass('hide', false);
            $(btn).siblings(".offShelf").toggleClass('hide', false);
        }

        function purchasedBtnFunc(btn) {
            $(btn).closest("tr").find(".currentStatus").html("販售中");
            $(btn).toggleClass('hide', true);
            $(btn).siblings(".oversell").toggleClass('hide', false);
            $(btn).siblings(".notifyCus").toggleClass('hide', true);
            $(btn).siblings(".offShelf").toggleClass('hide', true);
        }

        function offShelfBtnFunc(btn) {
            $(btn).closest("tr").find(".currentStatus").html("已下架");
            $(btn).toggleClass('hide', true);
            $(btn).siblings(".purchased").toggleClass('hide', true);
            $(btn).siblings(".notifyCus").toggleClass('hide', true);
            $(btn).siblings(".onShelf").toggleClass('hide', false);
        }

        function onShelfBtnFunc(btn) {
            $(btn).closest("tr").find(".currentStatus").html("販售中");
            $(btn).toggleClass('hide', true);
            $(btn).siblings(".oversell").toggleClass('hide', false);
        }

       //先別刪除
        function delProductColumn(btn) {
            var productID = $(btn).closest("tr").attr("productid");

            if (productID != "") {

                $.ajax({
                    type: 'post',
                    url: '@Url.Action("../Product/DelProductItem")',
                    data: {
                        StoreID: 'S1',
                        ProductID: productID
                    },
                    success: function (result) {
                        console.log("Del ProductItem ok");
                        $(btn).closest("tr").remove();
                    },
                    error: function () { alert("Error"); }
                });
            } else {
                $(btn).closest("tr").remove();
            }
        }


        function StatusConverToText(productStatus) {
            //上架btn ,  已售完btn , 已進貨btn+通知下單顧客+下架
            if (productStatus == 0) {
                return {
                    "statusName": '新品項，尚未上架',
                    "onSelf": '',
                    "oversell": 'hide',
                    "threeGroup":'hide'};
            }

            if (productStatus == 1) {
                return {
                    "statusName": '販售中',
                    "onSelf": 'hide',
                    "oversell": '',
                    "threeGroup": 'hide'
                };
            }
            if (productStatus == 2) {
                return {
                    "statusName": '已售完',
                    "onSelf": 'hide',
                    "oversell": 'hide',
                    "threeGroup": ''
                };
            }
            if (productStatus == 3) {
                return {
                    "statusName": '已下架',
                    "onSelf": '',
                    "oversell": 'hide',
                    "threeGroup": 'hide'
                };
            }
        }