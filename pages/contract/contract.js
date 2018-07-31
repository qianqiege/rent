Page({

  data: {
    pathCon: ''
  },
  onLoad: function (options) {
    var id = options.id;
    var order_no = options.order_no;
    this.setData({
      pathCon: 'https://client.test.mintongfu.com/rent-order/order-info?order_id='+id + '&page=lebaifen&order_no=' + order_no
    })
  },
})