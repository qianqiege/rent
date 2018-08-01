// pages/first/first.js
Page({

  data: {
    showModal:false
  },

  onLoad: function (options) {
    // var scene = decodeURIComponent(options.scene);
    // getApp().globalData.channel_code = scene;
    var scene = getApp().globalData.channel_code;
    if(scene ==''){
      this.setData({
        showModal:true
      })
    }else{
      getApp().login();
    }    
  },
})