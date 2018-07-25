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
    showModal:false,
    order:{},
    sku_name:''
  },

  onLoad: function (options) { 
    var that = this;
    //获取正在进行中的订单
    util.request(util.bashUrl + "/rent-order/get-process", { channel_code: getApp().globalData.channel_code }, function (result) {
      if (result.code == 0) {
        console.log(result.data)
        
        if( result.data != null ){
          var sku_name = result.data.sku_name;
          var sku = sku_name.replace(/,/g, " ");
          console.log(sku)
          that.setData({
            order: result.data,
            sku_name:sku,
            showModal:true
          });
        }
      }
    }, 'GET');

    //首页轮播图
    util.request(util.bashUrl + "/channel/channel-banner/rent-list", { channel_code: getApp().globalData.channel_code}, function (result) {
      if (result.code == 0){
        that.setData({
          banners: result.data
        });
      }    
    }, 'GET');

    //热门推荐产品
    util.request(util.bashUrl + "/channel/channel-hot-goods/rent-list", { channel_code: getApp().globalData.channel_code, business_type: 'is_rent' }, function (result) {
      console.log(result.data)
      if (result.code == 0) {
        that.setData({
          popular: result.data
        });
      }
    }, 'GET');

  },
  //关闭订单
  renewOrder(){
    this.setData({
      showModal:false
    })
    var id = this.data.order.id;
    console.log(id)
    util.request(util.bashUrl + "/rent-order/update-status", { order_id: id, action: 'close' }, function (result) {
      console.log(result);
      wx.showToast({
        title: '订单关闭成功！',
      })
    });
  },

  //重新下单
  continueOrder:function(){
    var id = this.data.order.id;
    var order = this.data.order;
    if (order.order_status == 0) {

    }
    console.log(id)
    wx.navigateTo({
      url: '../confirm/confirm?id='+id,
    })
  },

  goProduct(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../product/product?id='+id
    })
  }
})