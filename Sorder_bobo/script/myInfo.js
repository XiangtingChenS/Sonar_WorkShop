    var cookie;
    $(document).ready(function () {
        cookie = checkAndGetCookie();
        loadStoreInfoPage();
    });
   

    function loadStoreInfoPage() {
        $.ajax({
            type: 'post',
            url: '../Store/GetStoreInfo',
            data: {
                StoreID: cookie
            },
            success: function (response) {
                if (response.StoreImage != null) {
                    //initial
                    $("#storeInfo_storeImage").val('');
                    $("#storeInfo_storeImage").attr('value', '');
                    $("#storeInfo_storeImage").closest("div").find("br").remove();
                    $("#storeInfo_storeImage").closest("div").find("img").remove();

                    var img = document.createElement("img");
                    img.style.width = "100px";
                    img.src = response.StoreImage;
                    $("#storeInfo_storeImage").before('<br>');
                    $("#storeInfo_storeImage").before(img);
                }
               
                $("#storeInfo_storeAccount").val(response.StoreAccount);
                $("#storeInfo_storeKeeper").val(response.StoreKeeper)
                $("#storeInfo_storeName").val(response.StoreName)
                $("#storeInfo_storePhone").val(response.StorePhone)
                $("#storeInfo_storeAddress").val(response.Address)
                $("#storeInfo_storeIntroduction").val(response.StoreInformation)
            },
            error: function () {  }
        });

    }

    function loadProductGroupsPage() {
        $.ajax({
            type: 'post',
            url: '../Product/GetProductGroups',
            data: {
                StoreID: cookie
            },
            success: function (response) {
                //initial
                $("#productGroup_table").find("tbody tr").remove();

                for (var i = 0; i < response.length; i++) {
                    addProductGroupRow(response[i].ProductGroupID, response[i].ProductGroupTypeName, response[i].ProductGroupRemarkStatus) 
                }
            },
            error: function () { }
        });
    }

    function loadRemarkGroupsPage() {
        $.ajax({
            type: 'post',
            url: '../Product/GetRemarkGroupsAndRemarks',
            data: {
                StoreID: cookie
            },
            success: function (response) {
                //initial
                $("#remarkGroup_table").find("tbody tr").remove();

                for (var i = 0; i < response.length; i++) {
                    addRemarkRow(response[i].RemarkGroupID, response[i].ProductGroupTypeName, response[i].RemarkGroupTypeName, response[i].RemarkNames);
                }
            },
            error: function () { }
        });

    }

    function loadBusinessTimesPage() {
        $.ajax({
            type: 'post',
            url: '../Store/GetBusinessTimes',
            data: {
                StoreID: cookie
            },
            success: function (response) {
                //initial
                $("#businessTime_table").find("tbody tr").remove();
                for (var i = 0; i < response.length; i++) {
                    addBusinessTimeRow();

                    var week = response[i].Week;
                    var startTime = timefillZero(response[i].StartTime.Hours) + ":" + timefillZero(response[i].StartTime.Minutes);
                    var endTime = timefillZero(response[i].EndTime.Hours) + ":" + timefillZero(response[i].EndTime.Minutes);

                    $($(".businessTime_weekSelect")[i]).val(week);
                    $($(".businessTime_startTime")[i]).val(startTime);
                    $($(".businessTime_closedTime")[i]).val(endTime);
                }
            },
            error: function () { }
        });
    }

    function loadWaitTimePage() {
        $.ajax({
            type: 'post',
            url: '../Store/GetWaitTime',
            data: {
                StoreID: cookie
            },
            success: function (response) {
                $("#Unit").val(response.Unit);
                $("#OrderQuantity").val(response.OrderQuantity);
                $("#IntervalTime").val(response.IntervalTime);
            },
            error: function () { }
        });
    }

    function loadRemarkDetail(_this) {
        var remarkGroupID = $(_this).closest("tr").attr("id");
        $("#productGroup_remarkModal").attr("remarkGroupID", remarkGroupID);
        $.ajax({
            type: 'post',
            url: '../Product/GetRemarkDetailsByRemarkGroupID',
            data: {
                //這邊不需要StoreID，知道RemarkGroupID即可
                RemarkGroupID: remarkGroupID
            },
            success: function (response) {
                //initial
                $("#remarkDetail_table").find("tbody tr").remove();

                $("#productGroup_remarkModal").val(response.ProductGroupTypeName);
                for (var i = 0; i < response.RemarkIDs_list.length; i++) {
                    addRemarkDetailRow();

                    //set value
                    $($("#remarkDetail_table").find("tr")[i + 1]).attr("id", response.RemarkIDs_list[i])
                    $($(".remarkDetail_input")[i]).val(response.RemarkNames_list[i]);
                    if (i == 0) {
                        $($("#remarkDetail_table").find("td")[0]).text(response.RemarkGroupTypeName);
                    }
                }
            },
            error: function () { }
        });
    }


    function updatePassword() {
        var oldPasswordConfirm = $("#oldPasswordConfirm").val();
        var setNewPassword = $("#setNewPassword").val();
        var newPasswordConfirm = $("#newPasswordConfirm").val();

        if (setNewPassword != newPasswordConfirm) {
            console.log("新密碼不一致!");
        } else {
              $.ajax({
                type: 'post',
                url: '../Store/UpdateStorePassword',
                data: {
                    StoreID: cookie,
                    StoreOldPassword: oldPasswordConfirm,
                    StoreNewPassword: setNewPassword
                },
                success: function (result) {
                    if (result == "True") {
                        console.log("修改成功!");
                        $('#changePassword').modal('toggle');
                        cleanPasswordModalRow();
                    } else {
                        console.log("目前密碼 不正確!");
                    }
                },
                error: function () { }
            });
        }
    }

    function cleanPasswordModalRow() {
        $("#oldPasswordConfirm").val("");
        $("#setNewPassword").val("");
        $("#newPasswordConfirm").val("");
    }


    function updateStoreInfo() {
        var storeImage = $("#storeInfo_storeImage").attr("value");
        var storeKeeper = $("#storeInfo_storeKeeper").val();
        var storeName =  $("#storeInfo_storeName").val();
        var storePhone =  $("#storeInfo_storePhone").val();
        var storeAddress =  $("#storeInfo_storeAddress").val();
        var storeIntroduction = $("#storeInfo_storeIntroduction").val();

        $.ajax({
            type: 'post',
            url: '../Store/UpdateStoreInfo',
            data: {
                StoreID: cookie,
                StoreImage: storeImage,
                StoreKeeper: storeKeeper,
                StoreName: storeName,
                StorePhone: storePhone,
                Address: storeAddress,
                StoreInformation: storeIntroduction
            },
            success: function (result) {
                console.log("儲存成功!");
            },
            error: function () { }
        });
      
    }

    function addRemarkDetailRow() {
        $("#remarkDetail_table").append('<tr><td></td><td><input type="text" class="remarkDetail_input" value=""></td>'+
           '<td> <button type="button" class="btn btn-sm btn-danger fa fa-trash" onclick="deleteRemarkDetailRow(this)"></button></td></tr>');
    }


    function updateAndAddRemarkDetail() {
        var remarks = validRemarkDetailRow();

        $.ajax({
            type: 'post',
            url: '../Product/AddAndUpdateRemarkDetailsByRemarkGroupID',
            data: {
                //這邊不需要StoreID，知道RemarkGroupID即可
                RemarkGroupID: remarks.remarkGroupID,
                RemarkIDs_list: remarks.IDs,
                RemarkNames_list: remarks.Names
            },
            success: function (response) {
                //去調整主畫面顯示的字
                resetRemarkDetailRowText();
                //關閉modal  
                $("#updateRemark").modal("toggle")
            },
            error: function () { }
        });
    }

    //TODO 覺得刪除有問題 之後有時間要改  有兩個地方有一點不合邏輯
    function deleteRemarkDetailRow(_this) {
        var remarkID = $(_this).closest("tr").attr("id");
        //有帶remarkID的tr 就要發request去資料庫更改成不顯示狀態
        //沒有帶remarkID的tr 就直接刪除tr

        
        //if ($(_this).closest("tr").index() == 0 && $("#remarkDetail_table").find("tr").length > 1) {
        //    return console.log("應至少留下一備註細項!");
        //}

         //TODO 之後畫面要改吧! 備註名稱只有一小格  不應在table內
        if ($(_this).closest("tr").index() == 0) {
            return console.log("第一欄備註細項無法刪除!");
        }

        if (remarkID) {
            $.ajax({
                type: 'post',
                url: '../Product/DelRemarkDetailByRemarkID',
                data: {
                    //這邊不需要StoreID，知道RemarkGroupID即可
                    RemarkID: remarkID
                },
                success: function (response) {

                    //刪除資料 要去更改頁面上 備註細項的欄位 怕使用者 刪除完沒按儲存
                    //!!! 這裡做的機制有點怪!!!! 應該是要確定儲存 才刪除!!!
                    //TODO 先做這樣 有時間在改
                    deleteTableRow(_this);
                 
                    resetRemarkDetailRowText();
                },
                error: function () { }
            });
        } else {
            deleteTableRow(_this);
        }
    
    }

    function validRemarkDetailRow() {
        var remarkGroupID = $("#productGroup_remarkModal").attr("remarkgroupid");;
        var remarkIDs = [], remarkNames = [];
        for (var i = 0; i < $(".remarkDetail_input").length; i++) {
            var remarkID = $($(".remarkDetail_input")[i].closest("tr")).attr("id");
            var remarkName = $($(".remarkDetail_input")[i]).val();

            //只要有ID，或使用者有輸入，則可算有效欄位
            if (remarkID || remarkName) {
                if (!remarkID) {
                    remarkID = "";
                }
                remarkIDs.push(remarkID);
                remarkNames.push(remarkName);
            }
        }
        return { "remarkGroupID": remarkGroupID, "IDs": remarkIDs, "Names": remarkNames};
    }

    function resetRemarkDetailRowText() {
        var remarks = validRemarkDetailRow();
        var remarkNames = "";
        for (var i = 0; i < remarks.Names.length; i++) {
            remarkNames += remarks.Names[i] + "/";
        }
        //將最後一個反斜線取代掉
        var remarkNames = remarkNames.replace(/\/$/, '');

        var remarkGroupID = $("#productGroup_remarkModal").attr("remarkGroupID");
        $($("#" + remarkGroupID).find("td")[2]).text(remarkNames);
    }

    function uploadStoreImage(_this) {
        var file = _this.files[0];
        if (file) {
            $(_this).closest("div").find("br").remove();
            $(_this).closest("div").find("img").remove();
            var FR = new FileReader();

            FR.addEventListener("load", function (e) {
                _this.setAttribute("value", e.target.result);
                var img = document.createElement("img");
                img.style.width = "100px";
                img.src = e.target.result;
                $(_this).before('<br>');
                $(_this).before(img);
            });

            FR.readAsDataURL(file);
        }
    }
    
    function addBusinessTimeRow() {
        $("#businessTime_table").append("<tr><td><select class='businessTime_weekSelect'>" +
            "<option disabled selected value='-1'>請選擇</option >" +
            "<option value='0'>星期日</option>" +
            "<option value='1'>星期一</option>" +
            "<option value='2'>星期二</option > " +
            "<option value='3'>星期三</option > " +
            "<option value='4'>星期四</option > " +
            "<option value='5'>星期五</option > " +
            "<option value='6'>星期六</option > " +
            "</select></td>"+
            "<td><input type='time' class='businessTime_startTime' value='00:00'></td>" +
            "<td><input type='time' class='businessTime_closedTime' value='00:00'></td>"+
            "<td><button class='btn btn-sm btn-danger fa fa-trash-o' type= 'button' onclick= 'deleteTableRow(this)'></button><td></tr>");
    }

    function addProductGroupRow(productGroupID, ProductGroupTypeName, ProductGroupRemarkStatus) {
        $("#productGroup_table").append('<tr id=' + productGroupID + '><td>' + ProductGroupTypeName + '</td><td>' + ProductGroupRemarkStatusConvertToText(ProductGroupRemarkStatus) + '</td>' +
            '<td><button class="btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#productGroupModal" onclick="editProductGroupRow(this)">' +
            '<i class="fa fa-pencil" aria-hidden="true"></i></button></td>' +
            '<td><button type="button" class="btn btn-danger btn-sm" onclick="deleteProductGroupRow(this)">' +
            '<i class="fa fa-trash-o" aria-hidden="true"></i></button></td></tr>');
    }

    function addRemarkRow(remarkGroupID, productGroupTypeName, remarkGroupTypeName, remarkNames) {
        $("#remarkGroup_table").append('<tr id=' + remarkGroupID +'><td>' + productGroupTypeName + '</td><td>' + remarkGroupTypeName +
            '</td><td>' + remarkNames + '</td><td>' +
            '<button class="btn btn-sm btn-primary fa fa-pencil" type="button" data-toggle="modal" data-target="#updateRemark" onclick="loadRemarkDetail(this)">' +
            '</button></td><td><button type="button" class="btn btn-sm btn-danger fa fa-trash-o" onclick="deleteRemarkGroupRow(this)"></button></td></tr >');
    }


    function updateBusinessTime() {
      
        var weeks = [], startTimes = [], closedTimes = [];
        for (var i = 0; i < $(".businessTime_weekSelect").length; i++) {
            if ($($(".businessTime_weekSelect  option:selected")[i]).val() == "-1") {
                return console.log("請選擇星期!");
            }
            weeks.push($($(".businessTime_weekSelect  option:selected")[i]).val());
            startTimes.push($($(".businessTime_startTime")[i]).val());
            closedTimes.push($($(".businessTime_closedTime")[i]).val());
        }
        $.ajax({
            type: 'post',
            url: '../Store/UpdateBusinessTime',
            data: {
                StoreID: cookie,
                Weeks: weeks,
                StartTimes: startTimes,
                ClosedTimes: closedTimes
            },
            success: function (result) {
                console.log("儲存成功!");
            },
            error: function () { }
        });
    }

    function deleteTableRow(_this) {
        $(_this).closest("tr").remove();
    }

    function addProductGroupItem() {
        $("#productGroupModalTitle").text("新增營業類別");
        $("#PGName").val("");
        $("#openProductDetailRemark_Yes").prop("checked", true)
        $("#saveProductGroupModalBtn").off();

        $("#saveProductGroupModalBtn").click(function () {
            var getPGModalData = getProductGroupModalData();

            if (getPGModalData.ProductGroupTypeName.trim() == "") {
                return console.log("欄位不可為空!");
            }

            $.ajax({
                type: 'post',
                url: '../Product/AddProductGroupItem',
                data: {
                    StoreID: cookie,
                    ProductGroupTypeName: getPGModalData.ProductGroupTypeName,
                    ProductGroupRemarkStatus: getPGModalData.ProductGroupRemarkStatus
                },
                success: function (productGroupID) {
                    $("#productGroupModal").modal('toggle');
                    addProductGroupRow(productGroupID, getPGModalData.ProductGroupTypeName, getPGModalData.ProductGroupRemarkStatus);
                },
                error: function () { }
            });
        });
    }

    function editProductGroupRow(_this) {
        $("#productGroupModalTitle").text("修改營業類別");

        var productGroupID = $(_this).closest("tr").attr("id");

        //編輯時(modal開啟)，撈資料放在modal畫面上
        $.ajax({
            type: 'post',
            url: '../Product/GetProductGroupByProductGroupID',
            data: {
                StoreID: cookie,
                productGroupID: productGroupID
            },
            success: function (response) {
                $("#PGName").val(response.ProductGroupTypeName);

                if (response.ProductGroupRemarkStatus == 0) {
                    $("#openProductDetailRemark_Yes").prop("checked", true);
                } else {
                    $("#openProductDetailRemark_No").prop("checked", true);
                }
            },
            error: function () { }
        });

        $("#saveProductGroupModalBtn").off();
        //編輯儲存，將新的資料show在清單畫面上
        $("#saveProductGroupModalBtn").click(function () {
            var getPGModalData = getProductGroupModalData();

            if (getPGModalData.ProductGroupTypeName.trim() == "") {
                return console.log("欄位不可為空!");
            }

            $.ajax({
                type: 'post',
                url: '../Product/UpdateProductGroupByProductGroupID',
                data: {
                    StoreID: cookie,
                    ProductGroupID: productGroupID,
                    ProductGroupTypeName: getPGModalData.ProductGroupTypeName,
                    ProductGroupRemarkStatus: getPGModalData.ProductGroupRemarkStatus
                },
                success: function (response) {
                    $("#productGroupModal").modal("toggle");
                    //把修改的資料送回去，並更改畫面上資料
                    $($(_this).closest("tr").find("td")[0]).text(getPGModalData.ProductGroupTypeName);
                    $($(_this).closest("tr").find("td")[1]).text(ProductGroupRemarkStatusConvertToText(getPGModalData.ProductGroupRemarkStatus));
                },
                error: function () { }
            });

        });
    }

    function deleteProductGroupRow(_this) {
        //發一個request 去後端修改ProductGroupDisplayStatus //0顯示 1不顯示(店家在畫面上刪除該備註)
        if (confirm("確定要刪除嗎?\n營業備註將會一併刪除。")) {
            var productGroupID = $(_this).closest("tr").attr("id");
            $.ajax({
                type: 'post',
                url: '../Product/DelProductGroupByProductGroupID',
                data: {
                    StoreID: cookie,
                    productGroupID: productGroupID
                },
                success: function (response) {
                    deleteTableRow(_this);
                },
                error: function () { }
            });
        }

    }

    function deleteRemarkGroupRow(_this) {
        if (confirm("確定要刪除嗎?\n營業細項將會一併刪除。")) {
            var remarkGroupID = $(_this).closest("tr").attr("id");
            $.ajax({
                type: 'post',
                url: '../Product/DelRemarkGroupByRemarkGroupID',
                data: {
                    StoreID: cookie,
                    remarkGroupID: remarkGroupID
                },
                success: function (response) {
                    deleteTableRow(_this);
                },
                error: function () { }
            });
        }
    }

    function loadProductRemarkSelectOption() {
        //載入營業群組的選項
        $.ajax({
            type: 'post',
            url: '../Product/GetProductGroups',
            data: {
                StoreID: cookie
            },
            success: function (response) {
                //initial
                $("#remarkModal_Select").children().remove();
                $("#remarkModal_name").val("");
                $("#remarkModal_detail").val("");

                $("#remarkModal_Select").append('<option disabled selected value="-1">請選擇</option>');
                for (var i = 0; i < response.length; i++) {
                    $("#remarkModal_Select").append('<option value="' + response[i].ProductGroupID + '">' + response[i].ProductGroupTypeName +'</option>');
                }
            },
            error: function () { }
        });
    }

    function addNewRemarkData() {

        var productGroupTypeName = $("#remarkModal_Select  option:selected").text();
        var productGroupTypeID = $("#remarkModal_Select  option:selected").val()
        var remarkGroupTypeName = $("#remarkModal_name").val();
        var remarkNames = $("#remarkModal_detail").val();

        if (productGroupTypeID == "-1" || remarkGroupTypeName.trim() == "" || remarkNames.trim() == "")
        {
            return console.log("欄位皆不可為空!");
        }
        $.ajax({
            type: 'post',
            url: '../Product/AddRemarkGroupAndRemark',
            data: {
                StoreID: cookie,
                ProductGroupID: productGroupTypeID,
                RemarkGroupTypeName: remarkGroupTypeName,
                RemarkNames: remarkNames
            },
            success: function (remarkGroupID) {
                $("#addRemark").modal("toggle");
                addRemarkRow(remarkGroupID, productGroupTypeName, remarkGroupTypeName, remarkNames);
            },
            error: function () { }
        });
    }

 

    function updateWaitTime() {
        var Unit = $("#Unit").val();
        var OrderQuantity = $("#OrderQuantity").val();
        var IntervalTime = $("#IntervalTime").val();

        if (Unit == "" || OrderQuantity == "" || IntervalTime == "") {
            return console.log("欄位不可為空!");
        }
      
       $.ajax({
            type: 'post',
            url: '../Store/UpdateWaitTime',
            data: {
                StoreID: cookie,
                Unit: Unit,
                OrderQuantity: OrderQuantity,
                IntervalTime: IntervalTime
            },
            success: function (result) {
                console.log("儲存成功!");
            },
            error: function () { }
        });
    }


    function getProductGroupModalData() {
        var ProductGroupTypeName = $("#PGName").val();
        var ProductGroupRemarkStatus;  // 0訂單明細備註 1整筆訂單備註
        if ($("#openProductDetailRemark_Yes").prop("checked")) {
            ProductGroupRemarkStatus = 0;
        } else if ($("#openProductDetailRemark_No").prop("checked")) {
            ProductGroupRemarkStatus = 1;
        }

        return { "ProductGroupTypeName": ProductGroupTypeName, "ProductGroupRemarkStatus": ProductGroupRemarkStatus};
    }

    function ProductGroupRemarkStatusConvertToText(status) {
        if (status == 0) {
            return "是";
        }

        if (status == 1) {
            return "否";
        }
    }
