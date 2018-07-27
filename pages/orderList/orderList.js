// pages/orderList/orderList.js
const util = require('../../utils/util.js');
Page({
  data: {
    orderList: [],
    status: ['全部', '待完成', '已完成', '已取消'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderList: [0, 172, 348, 520],
    sliderLeft: 56,
    pay: '',
    close: '',
    id:'',
    show:0 ,
    showClose: false,
    reClose:false,
    reClose:'',
    msgClose: '',
    scrollTop: 0,
    scrollHeight: 0,
    index:0,
    hasOrder:true,
    hasAll:false,
    hasOther:false
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.onLoad()
  },

  onReachBottom: function () {
    var that = this;
    var leng = that.data.orderList.length;
    var aIndx = that.data.activeIndex;
    util.request(util.bashUrl + "/rent-order/list", {
      channel_code: getApp().globalData.channel_code,
      index: leng,
      type: aIndx
    }, function (result) {
      if (result.code == 0) {
        var leng = result.data.length;
        var o = that.data.orderList;
        for(var i=0;i<leng;i++){
          o.push(result.data[i])
        }
        that.setData({
          orderList: o
        })
      }
    }, 'GET');
  },

  //该方法绑定了页面滚动时的事件
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },

  onLoad: function(options) {
    var that = this;
    util.request(util.bashUrl + "/rent-order/list", {
      channel_code: getApp().globalData.channel_code,
      index: that.data.index,
      type: 0
    }, function (result) {
      if (result.code == 0) {
        console.log(result.data)
        if(result.data == ""){
          that.setData({
            hasOrder:false,
            hasAll:true
          })
        }else{
          that.setData({
            orderList: result.data
          })
        }
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
      index: that.data.index,
      type: id
    }, function(result) {
      console.log(result.data)
      if(result.data == ""){
        that.setData({
          hasOther:true,
          hasOrder:false
        })
      }else{
        that.setData({
          orderList: result.data,
          hasOther: false,
          hasOrder: true
        })
      } 
    }, 'GET');
  }
})