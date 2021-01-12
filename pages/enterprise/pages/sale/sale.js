const util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "XLLBZ-E5ARW-HUORQ-RE4OO-N3WIO-T6BW4",
    conent: "",
    show: false,
    title: null,
    markers: [],
    product: {
      id: null,
      latitude: null,
      longitude: null,
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.initLocation(this.data.product.latitude, this.data.product.longitude)
  },
  onLoad: function (options) {
    let product = JSON.parse(options.product)
    console.log(product)
    this.setData({
      product: product
    })
  },
  qqMapToBMap(lng, lat) {
    if (lng == null || lng == '' || lat == null || lat == '')
      return [lng, lat];

    var x_pi = 3.14159265358979324;
    var x = parseFloat(lng);
    var y = parseFloat(lat);
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    var lng = (z * Math.cos(theta) + 0.0065).toFixed(5);
    var lat = (z * Math.sin(theta) + 0.006).toFixed(5);
    return [lng, lat];

  },
  bMapToQQMap(lng, lat) {

    if (lng == null || lng == '' || lat == null || lat == '')
      return [lng, lat];

    var x_pi = 3.14159265358979324;
    var x = parseFloat(lng) - 0.0065;
    var y = parseFloat(lat) - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var lng = (z * Math.cos(theta)).toFixed(7);
    var lat = (z * Math.sin(theta)).toFixed(7);

    return [lng, lat];

  },
  initLocation(latitude, longitude) {
    let that = this
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=' + this.data.key,
      success(result) {
        let marks = [{
          height: 30,
          iconPath: "../../images/customer/map.png",
          id: 1,
          latitude: latitude,
          longitude: longitude,
          width: 30,
          city: result.data.result.address_component.city,
          district: result.data.result.address_component.district,
          province: result.data.result.address_component.province
        }]

        that.setData({
          markers: marks,
          "product.longitude": result.data.result.location.lng,
          "product.latitude": result.data.result.location.lat,
          conent: result.data.result.address
        })
      }
    })
  },
  getLocation(e) {
    this.initLocation(e.detail.latitude, e.detail.longitude)
  },
  addressInput(e) {
    this.setData({ conent: e.detail.value })
  },
  queryaddress(e) {
    this.setData({
      markers: e,
      "product.longitude": e[0].longitude,
      "product.latitude": e[0].latitude
    })
  },
  atuoGetLocation() {
    let that = this
    console.log(that.data.conent)

    qqmapsdk = new QQMapWX({
      key: that.data.key // 必填
    });
    let markers = []
    let marker = {}
    qqmapsdk.geocoder({
      address: that.data.conent,
      complete: res => {

        marker = {
          height: 30,
          iconPath: "../../images/customer/map.png",
          id: 1,
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          width: 30,
          city: res.result.address_components.city,
          district: res.result.address_components.district,
          province: res.result.address_components.province
        }
        markers.push(marker)
        that.queryaddress(markers)
      }
    });
  },

  bindBtnTap() {
    let location = this.qqMapToBMap(this.data.product.longitude, this.data.product.latitude)
    this.setData({
      "product.id": this.data.product.id,
      "product.longitude": location[0],
      "product.latitude": location[1],
    });

    let that = this
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/product/sell',
      data: that.data.product,
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '标注成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({

          })
        }
      }
    })
  }
})
