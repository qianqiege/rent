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
    animationData: {},
    skuList: [[], [{
      group_name: '支付',
      option_list: [{ option_name: '信用卡', value: 1, checked: 'true' }]
    }, {
        group_name: '分期',
        option_list: [{ option_name: '15期', value: 15, checked: 'true' }]
    }]],

    skuValue: [],
    showDetail: false,
  },

  onLoad: function (options) {
    var id = options.id;
    var that = this;
    util.request(util.bashUrl + "/rent-goods/model-detail", { channel_code: getApp().globalData.channel_code, business_type: 'is_rent', goods_id: id}, function (result) {
      console.log(result);

      var data = result.data.goods_sku_list;
      for (var i = 0, l = data.length; i < l; i++) {
        if (data[i]['option_list'].length == 1) {
          data[i]['option_list'][0].checked = 'true';
          console.log('123')
          // that.setData({
          //   skuValue: data[i]['option_list'][0].value
          // })
          // _this3.skuValue[i] = data[i]['option_list'][0].value;
        } else {
          // _this3.skuValue[i] = 0;
          // that.setData({
          //   skuValue : 0
          // })
        }
      }

      that.setData({
        product: result.data,
        'skuList[0]': result.data.goods_sku_list
      })
    }, 'GET');
  },
 

  //选择产品规格 颜色
  setModel(idx, model, value, disabled) {
    if (disabled == 'true') return;

    var skuList = this.data.skuList[idx];
    var skuInfo = skuList[model].data;
    console.log(skuList ,skuInfo)
    for (var k in skuInfo) {
      skuInfo[k].checked = skuInfo[k].value == value ? 'true' : '';
    }

    this.setData({
      'skuValue[model]': value
    })

    // this.skuValue[model] = value;

    // this.getPrice();
  },

  getSkuList(){
    var that = this;
    that.setData({
      showSku:true
    })
    that.getSkuInfo()
  },

  //获取产品价格信息
  getSkuInfo(){
    var that= this;
    util.request(util.bashUrl + "/rent-goods/get-sku-price", { channel_code: getApp().globalData.channel_code, business_type: 'is_rent', goods_id: that.data.product.goods_id, sku_ids: '1,3,5,6' }, function (result) {
      console.log(result);
      // that.setData({
      //   skuList: result.data
      // })
    }, 'GET');
  },

  // 隐藏产品详情
  hideSku(){
    var that = this;
    that.setData({
      showSku:false
    })
  },

  // 生成订单
  sendOrder() {
    var skuValue = this.data.skuValue;
    var skuList = this.data.skuList[0];
    var product = this.data.product;
    var skuName = [];
    var idx = skuValue.indexOf(0);

    if (idx != -1) {
      this.$parent.showErrMsg('请选择' + skuList[idx].title);
      return;
    }

    skuList.forEach(function (list, idx) {
      var name = list['data'].find(function (sku) {
        return sku.checked == 'true';
      });
      skuName.push(name.title);
    });

    var order = {
      skuName: skuName,
      skuValue: skuValue,
      amount: product.amount,
      brdname: product.brdname,
      goods_id: product.id,
      goods_name: product.goods_name,
      goods_image: product.goods_image,
      insu_cost: product.insu_cost,
      per_cost: product.per_cost,
      period: product.period,
      price: product.price,
      title: product.brdname + ' ' + product.goods_name + ' ' + skuName.join(' '),
      order_no: new Date().getTime(),
      imei: '',
      status: '待面签'
    };

    // this.$parent.globalData.order = order;

    // _wepy2.default.setStorage({
    //   key: 'order',
    //   data: order
    // });

    // _wepy2.default.navigateTo({
    //   url: 'checkimei'
    // });
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