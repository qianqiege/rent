// pages/orderList/orderList.js
const util = require('../../utils/util.js');
const STATUS_INIT = 0; //预订单
const STATUS_SUBMIT = 1; //已提交手机号
const STATUS_COMFIRM = 2; //已确认，订单确认页面已经点击确认
const STATUS_PAYMENT = 3; //已支付
const STATUS_COMP = 4;
const STATUS_CANCEL = 5;
Page({
  data: {
    orderList: [],
    status: ['全部', '待完成', '已完成', '已取消'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderList: [0, 172, 348, 520],
    sliderLeft: 72,
    pay: '',
    close: '',
    id:'',
    show:0 ,
    showClose: false,
    reClose:false,
    reClose:'',
    msgClose: '',
  },

  onLoad: function(options) {
    var that = this;
    util.request(util.bashUrl + "/rent-order/list", {
      channel_code: getApp().globalData.channel_code,
      index: 0,
      count: 20,
      type: 0
    }, function(result) {
      if (result.code == 0) {
        console.log(result);
        that.setData({
          orderList: result.data,
          id:result.data.id,
        })
      }
    }, 'GET');
  },

  tabClick(e) {
    var id = e.currentTarget.id;
    var that = this;
    console.log(id)
    that.setData({
      sliderOffset: this.data.sliderList[id],
      activeIndex: id
    })
    util.request(util.bashUrl + "/rent-order/list", {
      channel_code: getApp().globalData.channel_code,
      index: 0,
      count: 20,
      type: id
    }, function(result) {
      that.setData({
        orderList: result.data
      })
    }, 'GET');
  }
})