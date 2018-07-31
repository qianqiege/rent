Page({
  data: {
    pathPro: 'https://mp.weixin.qq.com/wxopen/devprofile?action=get_profile&token=2045146360&lang=zh_CN',
  },
  onLoad: function (options) {
    var pathPro = options.pathPro;
    console.log(options)
    this.setData({
      pathPro: pathPro
    })
  },
})