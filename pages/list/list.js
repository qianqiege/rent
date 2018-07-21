// pages/list/list.js
const util = require('../../utils/util.js');
Page({
  data: {
    brands: [], // 品牌列表，后期增加本地缓存
    models: [], // 所选的型号列表，后期增加本地缓存
    activeIndex: 0, // 默认选中的品牌 ID
    id: 1,
    // brdname: '全部',
    page: 1, // 当前页面，用于下拉到底时翻页
    windowHeight: null,
    windowWidth: null,
    loadmodel: true,

    animationData: []
  },

  onLoad: function (options) {
    var that = this;
    util.request(util.bashUrl + "/rent-goods/brand-list", { channel_code: getApp().globalData.channel_code, business_type: 'is_rent' }, function (result) {
      console.log(result);
      that.setData({
        brands:result.data
      })
    }, 'GET');
    that.getModel(0)
  },

  getBuy(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },
  
  /* 品牌列的点击事件*/
  tabClick(e) {
    console.log(e)
    var id = e.currentTarget.id;
    var name = e.currentTarget.dataset.name;
    var that= this;
    that.setData({
      activeIndex:id,
      id: id,
      models: [],
      page: 1
    })
    that.getModel(id)
  },
  getModel(id){
    var that = this;
    util.request(util.bashUrl + "/rent-goods/model-list", { channel_code: getApp().globalData.channel_code, business_type: 'is_sale', brdid:id }, function (result) {
      console.log(result);
      that.setData({
        models: result.data,
      })
    }, 'GET');
  }
})