// pages/success/success.js
const util = require('../../utils/util.js');
Page({
  data: {
    id: '',
    showChoose: false,
    confirmCancel: false,
    iemiMsg: '点击扫码',
    succCancel: false,
    order: {},
    sku_name: '',
    sku: [],
    sku1: [],
    curr: 10,
    color: [],
    verify: 0
  },

  onLoad: function(options) {
    var id = options.id;
    var that = this;
    that.setData({
      id: id
    })
    util.request(util.bashUrl + "/rent-order/detail", {
      order_id: id
    }, function (result) {
      console.log(result);
      that.setData({
        order: result.data,
      })
    }, 'GET');
  },

  // 扫码获取imei值
  scanCode: function() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        that.setData({
          iemiMsg: res.result
        });

        var id = that.data.id;
        var imei = that.data.iemiMsg;
        var sku1 = that.data.sku1;
        // var sku = that.data.sku;
        console.log(imei);
        util.request(util.bashUrl + "/rent-order/check-imei", {
          order_id: id,
          imei: imei
        }, function(result) {
          console.log(result.data)
          if (result.code == 0) {
            that.setData({
              verify: 1
            })
            
          }
        }, 'POST');
      }
    })
  },

  nextStep: function() {
    var that = this;
    var id = that.data.id;
    var imei = that.data.iemiMsg;
    var sku1 = that.data.sku1;
    var ver = that.data.verify;
    if (ver == 1) {
      wx.navigateTo({
        url: '../facesign/facesign?id=' + id + '&imei=' + imei + '&sku=' + sku1,
      })
    }
  },

  getSku:function(){
    var that = this;
    var id = that.data.id;
    util.request(util.bashUrl + "/rent-order/get-color-sku", {
      order_id: id
    }, function (result) {
      console.log(result.data)
      if (result.code == 0) {
        that.setData({
          color: result.data,
        })
        for (var i = 0; i < result.data.length; i++) {
          if (result.data[i].current == true) {
            that.setData({
              sku: result.data[i].sku,
            })
          }
        }
      }
    }, 'GET');
  },

  changeSpe: function() {
    var that = this;
    var id = that.data.id;
    that.setData({
      showChoose: true
    })

    that.getSku()

  },

  cancel: function() {
    this.setData({
      confirmCancel: true
    })
  },
  renewInfo: function() {
    var that = this;
    that.setData({
      confirmCancel: false,
      showChoose: true
    })
    that.getSku()
  },

  //取消订单更改订单状态
  confirmCancel: function() {
    var that = this;
    var id = that.data.id;
    util.request(util.bashUrl + "/rent-order/update-status", {
      order_id: id,
      action: 'close'
    }, function(result) {
      if (result.code == 0) {
        console.log(result);
        var sku_name = result.data.order.sku_name;
        var sku = sku_name.replace(/,/g, " ");
        that.setData({
          succCancel: true,
          order: result.data.order,
          sku_name: sku
        })
        wx.setNavigationBarTitle({
          title: '订单已取消'
        })
      }
    });
  },

  returnPage: function() {
    wx.navigateTo({
      url: '../home/home',
    })
  },



  // 换机选择不同的颜色
  setModel(e, disabled) {
    var that = this;
    if (disabled == 'true') return;
    var key = e.currentTarget.dataset.key;
    console.log(e)
    that.setData({
      curr: key,
      sku1: e.currentTarget.dataset.sku
    })
  },

  conbtn: function() {
    var that = this;
    var id = that.data.id;
    var sku1 = that.data.sku1;
    var sku = that.data.sku; 
    util.request(util.bashUrl + "/rent-order/save-new-sku", {
      order_id: id,
      reason: '',
      imei: '',
      sku: sku1,
      hanson: '',
      type: 0 //面签前操作
    }, function(result) {
      console.log(result)
      if (result.code == 0) {
        that.setData({
          iemiMsg: '点击扫码',
          showChoose: false
        })
      }
    });
  },

  showChoose: function() {
    this.setData({
      showChoose: false
    })
  },
  confirmCancel: function() {
    this.setData({
      confirmCancel: false
    })
  }

})