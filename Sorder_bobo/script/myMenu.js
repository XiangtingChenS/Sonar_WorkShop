    //var dataSet = [
    //    { "ProductGroupID": "PG1", "ProductImage": "", "ProductName": "米血", "ProductPrice": "10", "ProductStatus": "0", "a6": "" }
    //];
    var cookie;
    $(document).ready(function () {
        cookie = checkAndGetCookie();

        //我的菜單 - 產品群組下拉選單
        var PGSelect = document.createElement("select");
        PGSelect.setAttribute("class", "col-8 custom-select");
        PGSelect.setAttribute("required", "true");
        var emptyOption = document.createElement("option");
        PGSelect.appendChild(emptyOption);

        $.ajax({
            type: 'post',
            url: '@Url.Action("../Product/GetProductGroups")',
            data: {
                StoreID: cookie
            },
            success: function (response) {
                console.log(response);
                var option = document.createElement("option")
                for (var i = 0; i < response.length; i++) {
                   var option = document.createElement("option")
                   option.setAttribute("value", response[i].ProductGroupID);
                   var text = document.createTextNode(response[i].ProductGroupTypeName);
                   option.appendChild(text);
                   PGSelect.appendChild(option);
                }
                document.getElementById("productGroupSelect_modal").appendChild(PGSelect);
            },
            error: function () { alert("Error"); }
        });

        //我的菜單 - 所有產品
        $.ajax({
            type: 'post',
            url: '@Url.Action("../Product/GetProductInfo")',
            data: {
                StoreID: cookie
            },
            success: function (result) {
                genMyMenuTable(result);
            },
            error: function () { alert("Error"); }
        });
    });


    function genMyMenuTable(dataSet) {
      var table = $('#table-menu').DataTable({
          data: dataSet,
            columns: [
                { title: "類別", "width": "10%", data:"ProductGroupName" },
                {
                    title: "圖片", "width": "25%", data: "ProductImage",
                    render: function (data, type) {
                        if (data) {
                            return '<img src=' + data + '></img>'
                        } else {
                            return '<span>暫無圖片</span>'
                        }
                    }
                },
                { title: "品項", "width": "10%", data: "ProductName"},
                { title: "售價", "width": "10%", data: "ProductPrice", render: $.fn.dataTable.render.number(',', '.', 0, '$ ') },
                {
                    title: "目前狀態", "width": "15%", data: "ProductStatus",
                    render: function (data, type, row) {
                        if (!data) {
                            return '新商品，尚未上架'
                        }
                        return StatusConverToText(data).statusName;
                    }
                },
                {
                    data: null,
                    defaultContent: '',
                    orderable: false
                },
                {
                    data: null, "width": "3%",
                    defaultContent: '',
                    orderable: false
                },
                {
                    data: "ProductCreateDateTime",
                    defaultContent: '',
                    orderable: false
                }
                //{ title: "", data: "ProductStatus"  }
            ],
            lengthChange: false,
            pageLength: 5,
            select: true,
            "order": [[7, "desc"]],
            'aoColumnDefs': [{
                'bSortable': false,
                'aTargets': [1, 5, 6]
            }],
            "columnDefs": [
                { "visible": true, "targets": 0 }
            ],
            "fnCreatedRow": function (nRow, aData, iDataIndex) {
                //set each Tr id
                $(nRow).attr("id", aData.ProductID);

                $('td', nRow).eq(0).attr('type', aData.ProductGroupID);
                $('td', nRow).eq(4).addClass('currentStatus');

                var status;
                if (!aData) {
                    status = 0;
                } else {
                    status = aData.ProductStatus;
                }
                var statusBtn = StatusConverToText(status);
                $('td:eq(5)', nRow).append("<button class='btn btn-info oversell " + statusBtn.oversell + "' onclick='oversellBtnFunc(this)' >已售完</button>");
                $('td:eq(5)', nRow).append("<button class='btn btn-info purchased " + statusBtn.threeGroup + "' onclick='purchasedBtnFunc(this)'>已進貨 </button>");
                $('td:eq(5)', nRow).append("<button class='btn btn-warning notifyCus " + statusBtn.threeGroup + "' data-toggle='modal' data-target='#searchOrders' onclick='notifyCusBtnFunc(this)'>通知已下單顧客</button>");
                $('td:eq(5)', nRow).append("<button class='btn btn-danger offShelf " + statusBtn.threeGroup + "' onclick='offShelfBtnFunc(this)'>下架</button>");
                $('td:eq(5)', nRow).append("<button class='btn btn-danger onShelf " + statusBtn.onSelf + "' onclick='onShelfBtnFunc(this)'>上架</button>");

                $('td:eq(6)', nRow).append("<button class='fa fa-pencil transparentBtn' data-toggle='modal' data-target='#addFood' onclick='editProduct(this)' ></button>");
            }
        });

        table.column(7).visible(false);
       //$('#table-menu tbody').on('click', 'button', function () {
       //    console.log(this);
       //    //var data = table.row($(this).parents('tr')).data();
       //    //alert(data[0] + "'s salary is: " + data[5]);
       //});
    }

    function notifyCusBtnFunc(_this) {
        var productID = $(_this).closest("tr").attr("id")
       $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetNotifyOrderCusListByProductID")',
            data: {
                StoreID: cookie,
                ProductID : productID
            },
            success: function (response) {
                //initial
                $("#notifyCus_table").find("tbody tr").remove();
                $("#notifyCus_table").closest("div").find("span").remove();

                for (var i = 0; i < response.length; i++){
                    var orderID = response[i].OrderID;
                    var lastFourOrderID = orderID.substring(orderID.length - 4, orderID.length);
                   $("#notifyCus_table").append('<tr><td>' + lastFourOrderID + '</td><td>' +
                        response[i].CustomerName + '</td><td>' + response[i].CustomerPhone + '</td></tr >');
                }

                if (response.length == 0)
                {
                    $("#notifyCus_table").after("<span>沒有需要通知的顧客!</span>")
                }
            },
            error: function () { alert("Error"); }
        });
    }

    function addProduct() {
        $("#productGroupSelect_modal").find("select").val('');

        $("#uploadFile_modal").val('');
        $("#uploadFile_modal").attr('value', '');

        $("#productName_modal").val('');
        $("#productPrice_modal").val('');

        $("#productModalSubmit").off();
        $("#productModalSubmit").on("click", function () {

        var data = getProductModalData();
        if (data.productGroupID == "" || data.productName == "" || data.productPrice == "") {
            return alert("必填欄位不可為空!");
        }
        if (data.productGroupID == "" || data.productName == "" || data.productPrice == "") {
            return alert("必填欄位不可為空!");
        }
        $.ajax({
            type: 'post',
            url: '@Url.Action("../Product/AddProductItem")',
            data: {
                StoreID: cookie,
               ProductGroupID: data.productGroupID,
               ProductImage: data.productImage,
               ProductName: data.productName,
               ProductPrice: data.productPrice
            },
            success: function (response) {
                var table = $('#table-menu').DataTable();
                table.row.add({
                    "ProductID": response.ProductID,
                    "ProductGroupID": data.productGroupID, "ProductGroupName": data.productGroupName,
                    "ProductImage": data.productImage, "ProductName": data.productName,
                    "ProductPrice": data.productPrice, "ProductStatus": "0",
                    "ProductCreateDateTime": response.ProductCreateDateTime
                }).draw(false);
                $("#addFood").modal("toggle");
            },
            error: function () { alert("Error"); }
          });

        });

    }


    function editProduct(_this) {

        var productId = $(_this).closest('tr').attr("id");
        $("#uploadFile_modal").val('');
        $("#uploadFile_modal").attr('value', '');
        //帶資料到modal上
        var tds = $(_this).closest('tr').find('td');
        var productType = tds[0].getAttribute("type");
        var productName = tds[2].innerHTML;
        var productPrice = tds[3].innerHTML.replace("$ ", "");
        $("#productGroupSelect_modal").find("select").val(productType);
        $("#productName_modal").val(productName);
        $("#productPrice_modal").val(productPrice);
        //修改送出的事件
        $("#productModalSubmit").off();
        $("#productModalSubmit").on("click", function () {
            var data = getProductModalData();

            if (data.productGroupID == "" || data.productName == "" || data.productPrice == "") {
                return alert("必填欄位不可為空!");
            }

           $.ajax({
            type: 'post',
            url: '@Url.Action("../Product/UpdateProductItem")',
            data: {
                StoreID: cookie,
               productID: productId,
               ProductGroupID: data.productGroupID,
               ProductImage: data.productImage,
               ProductName: data.productName,
               ProductPrice: data.productPrice
            },
            success: function (result) {
                tds[0].innerHTML = data.productGroupName;
                $(tds[0]).attr("type", data.productGroupID);
                tds[2].innerHTML = data.productName;
                tds[3].innerHTML = "$ " + data.productPrice;

                if (data.productImage != "" && data.productImage != null)
                {
                    $(tds[1]).find("span").remove();
                    $(tds[1]).find("img").remove();
                    var img = document.createElement("img");
                    img.src = data.productImage;
                    $(tds[1]).append(img);
                }
                $("#addFood").modal("toggle");
            },
          error: function () { alert("Error"); }
          });
       });

    }

    function getProductModalData() {
        var productGroupID = $("#productGroupSelect_modal").find("select :selected").val()
        var productGroupName = $("#productGroupSelect_modal").find("select :selected").text()
        var productImage = $("#uploadFile_modal").attr("value");
        var productName = $("#productName_modal").val();
        var productPrice = $("#productPrice_modal").val();


        return {
            "productGroupID": productGroupID, "productGroupName": productGroupName, "productImage": productImage,
            "productName": productName, "productPrice": productPrice
        }
    }

    ///22222 TODO
    function uploadProductImage(uploadFile) {
        var file = uploadFile.files[0];

        if (file) {
            var FR = new FileReader();

            FR.addEventListener("load", function (e) {
                uploadFile.setAttribute("value", e.target.result);
            });

            FR.readAsDataURL(file);
        }
    }

    function myMenuGenerateItem() {
        var table = $('#table-menu').DataTable();
        table.row.add({ "ProductGroupID": "PG1","ProductGroupName":"滷味", "ProductImage": "", "ProductName": "米血", "ProductPrice": "10", "ProductStatus": "0", "a6": "" }).draw(false);
    }


    //11111 TODO
    function uploadProductImage(uploadFile) {
            var file = uploadFile.files[0];

            if (file) {
                var FR = new FileReader();

                FR.addEventListener("load", function (e) {
                    uploadFile.setAttribute("value", e.target.result);

                    var img = document.createElement("img");
                    img.src = e.target.result;
                    $(uploadFile).closest("td").prepend(img);
                });

                FR.readAsDataURL(file);
            }
        }

        function oversellBtnFunc(_this) {
            $(_this).closest("tr").find(".currentStatus").html("已售完");
            $(_this).toggleClass('hide',true);
            $(_this).siblings(".purchased").toggleClass('hide', false);
            $(_this).siblings(".notifyCus").toggleClass('hide', false);
            $(_this).siblings(".offShelf").toggleClass('hide', false);
            UpdateProductStatus(_this,2); //已售完
        }

        function purchasedBtnFunc(_this) {
            $(_this).closest("tr").find(".currentStatus").html("販售中");
            $(_this).toggleClass('hide', true);
            $(_this).siblings(".oversell").toggleClass('hide', false);
            $(_this).siblings(".notifyCus").toggleClass('hide', true);
            $(_this).siblings(".offShelf").toggleClass('hide', true);
            UpdateProductStatus(_this, 1); //販售中(已進貨)
        }

        function offShelfBtnFunc(_this) {
            $(_this).closest("tr").find(".currentStatus").html("已下架");
            $(_this).toggleClass('hide', true);
            $(_this).siblings(".purchased").toggleClass('hide', true);
            $(_this).siblings(".notifyCus").toggleClass('hide', true);
            $(_this).siblings(".onShelf").toggleClass('hide', false);
            UpdateProductStatus(_this, 3); //已下架
        }

        function onShelfBtnFunc(_this) {
            $(_this).closest("tr").find(".currentStatus").html("販售中");
            $(_this).toggleClass('hide', true);
            $(_this).siblings(".oversell").toggleClass('hide', false);
            UpdateProductStatus(_this, 1); //販售中(已上架)
        }


        function UpdateProductStatus(_this, productStatus) {
            var productID = $(_this).closest("tr").attr("id");
            $.ajax({
                type: 'post',
                url: '@Url.Action("../Product/UpdateProductStatus")',
                data: {
                    StoreID: cookie,
                    ProductID: productID,
                    ProductStatus : productStatus
                },
                success: function (result) {
                    console.log("update ProductItem ok");
                },
                error: function () { alert("Error"); }
            });
        }

       //先別刪除
        function delProductColumn(btn) {
            var productID = $(btn).closest("tr").attr("productid");

            if (productID != "") {

                $.ajax({
                    type: 'post',
                    url: '@Url.Action("../Product/DelProductItem")',
                    data: {
                        StoreID: cookie,
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