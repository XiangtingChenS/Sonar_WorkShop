  go();
    function go() {
         new Vue({
            el: '#preview',
            data: {
                scanner: null,
                activeCameraId: null,
                cameras: [],
                scans: []
            },
            mounted: function () {
                var self = this;
                self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
                self.scanner.addListener('scan', function (content, image) {
                      $.ajax({
                        type: 'post',
                        url: '@Url.Action("../Order/GetCustomerOrderInfo")',
                        data: {
                            OrderID: content
                        },
                        success: function (result) {
                            console.log(result);
                           //var table = "<table>" + "<tr><td>顧客姓名</td><td>" + result.CustomerName + "</td></tr>" +
                           //     "<tr><td>顧客電話</td><td>" + result.CustomerPhone + "</td></tr>" +
                           //     "<tr><td>訂單總金額</td><td>" + result.TotalAmount+"</td></tr>" +
                           //     "<tr><td>訂單明細</td><td>" + result.OrderDetail+"</td></tr></table>"
                           //$("#QRCodeContent").html(table);
                            $("#QRCodeContent").html("顧客姓名：" + result.CustomerName + "<br>" +
                                "顧客電話：" + result.CustomerPhone + "<br>" +
                                "訂單總金額：" + result.TotalAmount + "<br>" +
                                "訂單明細：" + result.OrderDetail);
                        },
                        error: function () {
                            $("#QRCodeContent").html("無法辨識此QR Code!");
                        }
                    });

                    self.scans.unshift({ date: +(Date.now()), content: content });
                });
                Instascan.Camera.getCameras().then(function (cameras) {
                    self.cameras = cameras;
                    if (cameras.length > 0) {
                        self.activeCameraId = cameras[0].id;
                        self.scanner.start(cameras[0]);
                    } else {
                        console.error('No cameras found.');
                    }
                }).catch(function (e) {
                    console.error(e);
                });
            },
            methods: {
                formatName: function (name) {
                    return name || '(unknown)';
                },
                selectCamera: function (camera) {
                    this.activeCameraId = camera.id;
                    this.scanner.start(camera);
                }
            }
        });
    }