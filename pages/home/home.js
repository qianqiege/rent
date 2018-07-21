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
    showModal: true
  },

  onLoad: function (options) { 
    var that = this;
    util.request(util.bashUrl + "/channel/channel-banner/rent-list", { channel_code: getApp().globalData.channel_code}, function (result) {
      if (result.code == 0){
        that.setData({
          banners: result.data
        });
      }    
    }, 'GET');

    util.request(util.bashUrl + "/channel/channel-hot-goods/rent-list", { channel_code: getApp().globalData.channel_code, business_type: 'is_rent' }, function (result) {
      console.log(result.data)
      if (result.code == 0) {
        that.setData({
          popular: result.data
        });
      }
    }, 'GET');

  },

  renewOrder(){
    this.setData({
      showModal:false
    })
  },

  goProduct(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../product/product?id='+id
    })
  }
})