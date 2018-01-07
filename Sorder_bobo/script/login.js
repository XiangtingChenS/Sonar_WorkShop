    function initialField(){
        //initial
        $("#account_login").val("");
        $("#password_login").val("");

        $("#account_register").val("");
        $("#password_register").val("");
        $("#passwordConfirm_register").val("");
        $("#name_register").val("");
        $("#phone_register").val("");
    }

    function storeRegister() {
  

       var account = $("#account_register").val();
       var password = $("#password_register").val();
       var passwordConfirm = $("#passwordConfirm_register").val();
       var name = $("#name_register").val();
       var phone = $("#phone_register").val();

       if (!account || !password || !passwordConfirm || !name || !phone) {
           return console.log("欄位皆不可為空白!")
       } else if (password != passwordConfirm) {
          return console.log("密碼不一致，請確認密碼!")
       }

       $.ajax({
           type: 'post',
           url: '../Store/StoreRegister',
           data: {
               StoreAccount: account,
               StorePassword: password,
               StoreKeeper: name,
               StorePhone: phone
           },
           success: function (storeID) {
              $("#register").modal("toggle");
              console.log("註冊成功!");
           },
           error: function () { console.log("帳號已重複!"); }
       });
    }

    function storeLogin() {
        var account = $("#account_login").val();
        var password = $("#password_login").val();
        if (!account) {
            return console.log("帳號欄位不可為空!")
        }

        if (!password) {
            return console.log("密碼欄位不可為空!")
        }

        $.ajax({
            type: 'post',
            url: '../Store/StoreLogin',
            data: {
                StoreAccount: account,
                StorePassword: password
            },
            success: function (storeID) {
                console.log("登入成功")
                setCookie("StoreID", storeID, 0.5);

                //直接跳轉到 "我的資訊" 頁面
                window.location.href = "../Store/MyInfo";
            },
            error: function (responseText) { console.log("登入失敗") }
        });
        
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
