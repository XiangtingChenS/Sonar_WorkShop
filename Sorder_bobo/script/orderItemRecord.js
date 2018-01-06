    var cookie;
    $(document).ready(function () {
        cookie = checkAndGetCookie();

        //$('#dailyTable_OrderItemRecord').DataTable({
        //    lengthChange: false,
        //    pageLength: 10
        //});
        //$('#monthlyTable_OrderItemRecord').DataTable({
        //    lengthChange: false,
        //    pageLength: 10
        //});
        //$('#yearlyTable_OrderItemRecord').DataTable({
        //    lengthChange: false,
        //    pageLength: 10
        //});
    });


    $(function () {
        $('#selectDay_OrderItemRecord').datepicker({
            dateFormat: 'yy-mm-dd',
            beforeShow: function (el, dp) {
                hideDateElement(false, false);
            }
            //onClose: function (dateText, inst) {
            //    var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            //    var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            //    var day = $("#ui-datepicker-div .ui-datepicker-day :selected").val();
            //    $(this).datepicker('setDate', new Date(year, month, day, 1));
            //}
        });

        $('#selectMonth_OrderItemRecord').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy-mm',
            beforeShow: function (el, dp) {
                hideDateElement(true, false);
            },
            onClose: function (dateText, inst) {
                var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                $(this).datepicker('setDate', new Date(year, month, 1));
                getDataByMonth();
            }
        });

        $('#selectYear_OrderItemRecord').datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'yy',
            beforeShow: function (el, dp) {
                hideDateElement(true, true);
            },
            onClose: function (dateText, inst) {
                var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                $(this).datepicker('setDate', new Date(year, month, 1));
                getDataByYear();
            }
        });

    });

    function hideDateElement(boo1, boo2) {
        $('#ui-datepicker-div').toggleClass('hide-calendar', boo1);
        $('#ui-datepicker-div').toggleClass('hide-month', boo2);
    }

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
            error: function () { alert("Error"); }
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
            error: function () { alert("Error"); }
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
            error: function () { alert("Error"); }
         });
    }


    function genOrderItemRecordsDataTable(tableID, dataSet, salesBestID, salesWorstID) {
        var table = $(tableID).DataTable({
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