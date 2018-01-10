function dateCommon(dayId, monthId, YearId){
	    $(dayId).datepicker({
            dateFormat: 'yy-mm-dd',
            beforeShow: function (el, dp) {
                hideDateElement(false, false);
            }
        });

        $(dayId).datepicker({
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

        $(YearId).datepicker({
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
}


function hideDateElement(boo1, boo2) {
	$('#ui-datepicker-div').toggleClass('hide-calendar', boo1);
	$('#ui-datepicker-div').toggleClass('hide-month', boo2);
}