// pages/home/home.js
const util = require('../../utils/util.js');
Page({
  data: {
    banners: [],
    animationData: [],
    indicatorDots: true,
    autoplay: true,
    indicatorColor: 'rgba(255,96,0,.2)',
    currColor: 'rgba(255,96,0,1)',
    circular: true,
    interval: 3000,
    duration: 1000,
    advantage: [
      '../../images/home/rest.png',
      '../../images/home/free.png',
      '../../images/home/relax.png',
      '../../images/home/flexible.png'
    ],
    popular: [],
    showModal: false,
    order: {},
    sku_name: '',
    showClose: false,
  },

  onLoad: function(options) {
    var that = this;
    //获取正在进行中的订单
    util.request(util.bashUrl + "/rent-order/get-process", {
      channel_code: getApp().globalData.channel_code
    }, function(result) {
      if (result.code == 0) {
        console.log(result.data)
        if (result.data != null) {
          var sku_name = result.data.sku_name;
          var sku = sku_name.replace(/,/g, " ");
          that.setData({
            order: result.data,
            sku_name: sku,
            showModal: true
          })
        }
      }
    }, 'GET');

    //首页轮播图
    util.request(util.bashUrl + "/channel/channel-banner/rent-list", {
      channel_code: getApp().globalData.channel_code
    }, function(result) {
      if (result.code == 0) {
        that.setData({
          banners: result.data
        });
      }
    }, 'GET');

    //热门推荐产品
    util.request(util.bashUrl + "/channel/channel-hot-goods/rent-list", {
      channel_code: getApp().globalData.channel_code,
      business_type: 'is_rent'
    }, function(result) {
      if (result.code == 0) {
        that.setData({
          popular: result.data
        });
      }
    }, 'GET');

  },
  //关闭订单
  renewOrder() {
    var that = this;
    that.setData({
      showModal: false
    })
    var id = that.data.order.id;
    console.log(id)
    util.request(util.bashUrl + "/rent-order/update-status", {
      order_id: id,
      action: 'close'
    }, function(result) {
      console.log(result);
      if (result.code == 0) {
        that.setData({
          showClose: true
        })
        setInterval(function() {
          that.setData({
            showClose: false
          })
        }, 3000)
      }
    });
  },

  //继续下单
  continueOrder: function() {
    var id = this.data.order.id;
    var order = this.data.order;
    var status = order.order_status;
    console.log(order)
    if (status == 0) {
      wx.navigateTo({
        url: '../login/login?id=' + id,
      })
    } else if (status == 1) {
      wx.navigateTo({
        url: '../confirm/confirm?id=' + id,
      })
    } else if (status == 2) {
      wx.navigateTo({
        url: '../card/card?id=' + id,
      })
    } else if (status == 3 && order.imei == '') {
      wx.navigateTo({
        url: '../success/success?id=' + id,
      })
      
    } else if (status == 3 && order.imei !== '') {
      wx.navigateTo({
        url: '../facesign/facesign?id=' + id,
      })
    }
  },

  //去到产品详情页
  goProduct(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  }
})