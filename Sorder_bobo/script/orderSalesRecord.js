    var cookie;
    $(document).ready(function () {
        cookie = checkAndGetCookie();
		dateCommon('#selectDay_OrderSalesRecord', '#selectYear_OrderSalesRecord', '#selectYear_OrderSalesRecord');
    });

    function getDataByDay() {
        $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetOrderSalesRecordsByDay")',
            data: {
                StoreID: cookie,
                day: $('#selectDay_OrderSalesRecord').val()
            },
            success: function (result) {
                genOrderItemRecordsDataTable('#dailyTable_OrderSalesRecord', "時間", result);
                judgeEmptyData(result, "#lastQuarterSalesAmountByDay_OrderSalesRecord", "#currentQuarterSalesAmountByDay_OrderSalesRecord",
                    "昨日總銷售量", "今日總銷售量", "#growthByDay_OrderSalesRecord");
            },
            error: function () { console.log("Error"); }
         });
        }
        function getDataByMonth() {
         $.ajax({
            type: 'post',
            url: '@Url.Action("../Order/GetOrderSalesRecordsByMonth")',
            data: {
                StoreID: cookie,
                month: $('#selectMonth_OrderSalesRecord').val()
            },
            success: function (result) {
                genOrderItemRecordsDataTable('#monthlyTable_OrderSalesRecord', "日期", result);
                judgeEmptyData(result, "#lastQuarterSalesAmountByMonth_OrderSalesRecord", "#currentQuarterSalesAmountByMonth_OrderSalesRecord",
                    "上月總銷售量", "本月總銷售量", "#growthByMonth_OrderSalesRecord");
            },
            error: function () { console.log("Error"); }
         });
    }

        function getDataByYear() {
             $.ajax({
                type: 'post',
                url: '@Url.Action("../Order/GetOrderSalesRecordsByYear")',
                data: {
                    StoreID: cookie,
                    year: $('#selectYear_OrderSalesRecord').val()+"-"+"11" //TODO 暫時用這樣(後面要接月份 後端才會認為是日期)
                },
                success: function (result) {
                    genOrderItemRecordsDataTable('#yearlyTable_OrderSalesRecord', "月份", result);
                    judgeEmptyData(result, "#lastQuarterSalesAmountByYear_OrderSalesRecord", "#currentQuarterSalesAmountByYear_OrderSalesRecord",
                        "去年總銷售量", "今年總銷售量", "#growthByYear_OrderSalesRecord");
                },
                error: function () { console.log("Error"); }
             });
        }

        function genOrderItemRecordsDataTable(tableID, dataTitle, dataSet) {
             $(tableID).DataTable({
                destroy: true,
                data: dataSet.salesRecordTableData,
                columns: [
                    { title: dataTitle, data: "DateOrTime" },
                    { title: "總金額", data: "PeriodTotalPric1e", render: $.fn.dataTable.render.number(',', '.', 0, '$ ') }
                ],
                lengthChange: false,
                pageLength: 10,
                select: true
            });
        }

        function judgeEmptyData(dataSet, lastQuarterID, currentQuarterID, lastQuarterName, currentQuarterName, growthID) {
            $(lastQuarterID).text(lastQuarterName + "：" + dataSet.LastQuarterSalesAmount);
            $(currentQuarterID).text(currentQuarterName + "：" + dataSet.CurrentQuarterSalesAmount);
            $(growthID).text("成長量：" + dataSet.Growth);
             // $(tableID).DataTable().clear().draw();
        }