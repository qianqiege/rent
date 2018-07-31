Page({
  data: {
    path: ''
  },
  onLoad: function (options) {
    var id = options.id;
    var order_no = options.order_no;
    this.setData({
      path: 'https://client.test.mintongfu.com/rent-order/order-info?order_id='+id+'&page=yixiang&order_no='+order_no
    })
  },
})