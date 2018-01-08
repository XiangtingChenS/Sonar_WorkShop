    $(document).ready(function () {
          $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetOrderHistory")',
            data: {
                StoreID: checkAndGetCookie()
            },
            success: function (result) {
                genOrderHistiry(result);
            },
            error: function () { console.log("Error"); }
         });
    });

    function genOrderHistiry(dataSet) {
        $('#table-orderRecord').DataTable({
            data: dataSet,
            columns: [
              //  { title: "訂單編號", "width": "15%", data: "OrderID" },
                { title: "訂購時間", "width": "20%", data: "OrderDateTime" },
                { title: "訂單內容",data: "OrderContent"},
                { title: "總金額", "width": "10%", data: "TotalPrice", render: $.fn.dataTable.render.number(',', '.', 0, '$ ') }
            ],
            lengthChange: false,
            pageLength: 10,
            select: true
        });

    }