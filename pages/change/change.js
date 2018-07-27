// pages/change/change.js
Page({
  data: {
    id:'',
    reason:''
  },

  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
    })
  },

  textInput:function(e){
    var text = e.detail.value;
    this.setData({
      reason:text
    })
  },

  confirmChange:function(){
    var that = this;
    var reason = that.data.reason;
    var id = that.data.id;
    if(reason !== ''){
      wx.navigateTo({
        url: '../verify/verify?id=' + id + '&reason=' + reason,
      })
    }  
  }
})