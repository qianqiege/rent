Page({
  data: {
    pathPro: '',
  },
  onLoad: function (options) {
    var id = options.id;
    var order_no = options.order_no;
    this.setData({
      pathPro: 'https://client.test.mintongfu.com/rent-order/order-info?order_id='+id + '&page=baozhang&order_no=' + order_no
    })
  },
})