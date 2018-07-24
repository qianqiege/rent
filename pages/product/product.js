// pages/product/product.js
const util = require('../../utils/util.js');
Page({
  data: {
    product: {},
    tabs: ['租机流程', '费用说明', '商品介绍', '常见问题'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderList: [0, 185, 365, 550],
    sliderLeft: 30,

    showSku: false,
    insu_price:'',
    animationData: {},
    skuList: [
      [],
      [{
        group_name: '支付',
        option_list: [{
          option_name: '信用卡',
          option_id: 1,
          checked: 'true'
        }]
      }, {
        group_name: '分期',
        option_list: [{
          option_name: '15期',
          option_id: 15,
          checked: 'true'
        }]
      }]
    ],

    skuValue: [],
    showDetail: false,
    proSku: {},
    order: {}
  },

  onLoad: function(options) {
    var id = options.id;
    var that = this;
    util.request(util.bashUrl + "/rent-goods/model-detail", {
      channel_code: getApp().globalData.channel_code,
      business_type: 'is_rent',
      goods_id: id
    }, function(result) {
      console.log(result);
      var data = result.data.goods_sku_list;
      var insu_price = result.data.insu_price;
      var arr = [];
      for (var i = 0, l = data.length; i < l; i++) {
        if (data[i]['option_list'].length <= 2) {
          data[i]['option_list'][0].checked = 'true';
          var opt_id = data[i]['option_list'][0].option_id;
          arr.push(opt_id);
          that.setData({
            skuValue: arr
          })
        } else {
          data[i]['option_list'][0].checked = 'true';
          that.setData({
            skuValue: 0
          })
        }
      }
      that.setData({
        product: result.data,
        'skuList[0]': result.data.goods_sku_list,
        insu_price:insu_price
      })
    }, 'GET');
    // this.getSkuInfo()
  },


  //选择产品规格 颜色
  setModel(e, idx, model, value, disabled) {
    if (disabled == 'true') return;
    var idx = e.currentTarget.dataset.wpysetmodelA;
    var model = e.currentTarget.dataset.wpysetmodelB;
    var value = e.currentTarget.dataset.wpysetmodelC;
    var skuList = this.data.skuList[idx];
    var skuInfo = skuList[model].option_list;
    var optArr = [];
    for (var k in skuInfo) {
      skuInfo[k].checked = skuInfo[k].option_id == value ? 'true' : '';
    }
    for (var j = 0; j < skuList.length; j++) {
      var opt = skuList[j].option_list;
      for (var p = 0; p < opt.length; p++) {
        if (opt[p].checked == 'true') {
          var optList = opt[p].option_id;
          optArr.push(optList)
        }
      }
    }
    this.setData({
      'skuList[0]': skuList,
      skuValue: optArr
    })
    this.getSkuInfo()
  },

  getSkuList() {
    var that = this;
    that.setData({
      showSku: true
    })
    that.getSkuInfo()
  },

  //获取产品价格信息
  getSkuInfo() {
    var that = this;
    var sku = this.data.skuValue;
    var idx = sku.indexOf(0);
    if (idx == -1) {
      var skuStr = sku.toString();
      console.log(skuStr)
      util.request(util.bashUrl + "/rent-goods/get-sku-price", {
        channel_code: getApp().globalData.channel_code,
        business_type: 'is_rent',
        goods_id: that.data.product.goods_id,
        sku_ids: skuStr
      }, function(result) {
        console.log(result);
        that.setData({
          proSku: result.data
        })
      }, 'GET');
    }
  },

  // 隐藏产品详情
  hideSku() {
    var that = this;
    that.setData({
      showSku: false
    })
  },

  // 生成订单
  sendOrder() {
    var skuValue = this.data.skuValue;
    var skuList = this.data.skuList[0];
    var product = this.data.product;
    var skuName = [];
    var skuStr = skuValue.toString();

    // skuList.forEach(function(list, idx) {
    //   var s = list['data'];
    //   // return sku.checked == 'true';

    //   // skuName.push(name.title);
    // });

    var data = {
      goods_id: product.goods_id,
      channel_id: 1,
      store_id: 1,
      sku: skuStr, //用户选择机型规格等信息
      order_type: 'rent', //租赁 - rent，购买 - sale
      app_source: 'wxapp',
      pay_platform: 'lbf',
    };

    var that = this;
    util.request(util.bashUrl + "/rent-order/create", data, function(result) {
      console.log(result);
      if (result.code == 0) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        });
        var id = result.data.id;
        wx.navigateTo({
          url: '../login/login?id='+id
        });
      } else {
        wx.showModal({
          title: '提示',
          content: result.msg,
          showCancel: false
        });
      }
      // getApp().globalData.order = result.data;
      // wx.setStorage({
      //   key: 'order',
      //   data: result.data
      // });
      
      
    });

  },

  //切换产品详情介绍信息
  tabClick(e) {
    var id = e.currentTarget.id;
    var that = this;
    that.setData({
      sliderOffset: this.data.sliderList[id],
      activeIndex: id
    })
  },
})