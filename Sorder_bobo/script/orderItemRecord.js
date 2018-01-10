    var cookie;
    $(document).ready(function () {
        cookie = checkAndGetCookie();
		dateCommon('#selectDay_OrderItemRecord', '#selectMonth_OrderItemRecord', '#selectYear_OrderItemRecord');
    });

    function getDataByDate() {
        $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetOrderItemRecordsByDay")',
            data: {
                StoreID: cookie,
                day: $('#selectDay_OrderItemRecord').val()
            },
            success: function (result) {
                genOrderItemRecordsDataTable('#dailyTable_OrderItemRecord', result, "#salesBestByDay_OrderItemRecord", "#salesWorstByDay_OrderItemRecord");
            },
            error: function () { console.log("Error"); }
         });
    }

    function getDataByMonth() {
         $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetOrderItemRecordsByMonth")',
            data: {
                StoreID: cookie,
                month: $('#selectMonth_OrderItemRecord').val()
            },
            success: function (result) {
                genOrderItemRecordsDataTable('#monthlyTable_OrderItemRecord', result, "#salesBestByMonth_OrderItemRecord", "#salesWorstByMonth_OrderItemRecord");
            },
            error: function () { console.log("Error"); }
         });
    }

    function getDataByYear() {
         $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetOrderItemRecordsByYear")',
            data: {
                StoreID: cookie,
                year: $('#selectYear_OrderItemRecord').val()+"-"+"11" //TODO 暫時用這樣(後面要接月份 後端才會認為是日期)
            },
            success: function (result) {
                genOrderItemRecordsDataTable('#yearlyTable_OrderItemRecord', result, "#salesBestByYear_OrderItemRecord", "#salesWorstByYear_OrderItemRecord");
            },
            error: function () { console.log("Error"); }
         });
    }


    function genOrderItemRecordsDataTable(tableID, dataSet, salesBestID, salesWorstID) {
        $(tableID).DataTable({
            destroy: true,
            data: dataSet,
            columns: [
                { title: "品項", data: "ProductName" },
                { title: "數量", data: "Quantity" },
                { title: "總金額", data: "TotalPrice", render: $.fn.dataTable.render.number(',', '.', 0, '$ ') }
            ],
            "order": [[1, "desc"]],
            lengthChange: false,
            pageLength: 10,
            select: true
        });

      
      judgeEmptyData(tableID, dataSet, salesBestID, salesWorstID);
    }

    function judgeEmptyData(tableID, dataSet, salesBestID, salesWorstID) {
        //由小到大
        var sortData = dataSet.sort(function (a, b) {
            return a.Quantity > b.Quantity ? 1 : -1;
        });
       
        if (sortData.length > 1) {
             //TODO 有漏洞 萬一有兩個銷售量  一樣的，也要一併顯示(還未做)
            $(salesBestID).text("銷售量最佳：" + sortData[sortData.length - 1].ProductName);
            $(salesWorstID).text("銷售量最差：" + sortData[0].ProductName);
        } else {
            $(salesBestID).text("銷售量最佳：暫無");
            $(salesWorstID).text("銷售量最差：暫無");
        }
    }