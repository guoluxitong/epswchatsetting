//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    DeviceTypeArray: [],
    DeviceType: "",
    DeviceFactoryArray: [],
    DeviceFactory: "",
    DeviceLineArray: [],
    DeviceLine: "",
    DeviceAttrArray: [],
    DeviceAttr: "",
    deviceMapId: "",
    deviceMapTitle: "",
    DeviceMapArray: [],
    ParamsArray: [],
    cnId: "",
    params: [],
    stationNo: "",
    deviceNo: "",
    sn:"",
    sim:"",
    canctlarray: ["不可控", "可控"],
    canctl: 0,
  },
  bindPickerChange_canctl: function (e) {
    var that = this
    that.setData({
      canctl: e.detail.value,
    })
  },
  saveSetting: function (e) {
    var that = this
    if (that.data.deviceMapId == '') {
      wx.showToast({
        title: "点为表id不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.deviceMapId == '') {
      wx.showToast({
        title: "点为表id不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/product/search?pageNum=1&pageSize=5',
      data: {
        boilerNo: "",
        controllerNo: "0233333333",
        customerName: null,
        isSell: null,
        media: null,
        power: null,
        productCategoryId: null,
        productCategoryName: "",
        saleDate: null,
        tonnageNum: null,
        userId: app.globalData.enterprise.employeeId,
      },

      method: 'post',
      success: function (data) {
        console.log(data)
        let arr = data.data.data.list
        
          if (arr.length == 0) {
            that.setData({
              "product.controllerNo":"0233333333",
              "product.userId": app.globalData.enterprise.userId,
              "product.roleIdArray.roleId": app.globalData.enterprise.roleId,
              "product.roleIdArray.roleName": app.globalData.enterprise.roleName,
              "product.isSell": 0,
              "product.orgId": app.globalData.enterprise.orgId,
            })
            wx.request({
              //获取openid接口   
              url: app.globalData.webapi + '/webapi/enterprise/product/create',
              data: that.data.product,
              method: 'post',
              success: function (data) {
             
              }
            })
          }

        }


      
    })
  
    
    wx.request({
      url: app.globalData.webapi + '/wechat/device/modify',
      data: {
        power: 0,
        media: 0,
        prefix: that.data.prefix,
        deviceNo: that.data.deviceNo,
        status: 1,
        cnId:  that.data.cnId,
        isCanCtl: that.data.canctl,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if(res.data.code==0){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000,
            success(res) {
              wx.switchTab({
                url: '../index/index'
              })
            }
          });
        }else{
          wx.showToast({
            title:res.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
    

  },
  simInput: function (e) {
    var that = this
    that.setData({
      sim: e.detail.value
    })
  },
  deviceNoInput: function (e) {
    var that = this
    that.setData({
      deviceNo: e.detail.value
    })
  },
  stationNoInput: function (e) {
    var that = this
    that.setData({
      stationNo: e.detail.value
    })
  },
  paramInput: function (e) {
    var that = this
    var params = that.data.params
    params[e.currentTarget.dataset.index] = e.detail.value
    that.setData({
      params: params
    })
  },
  bindDeviceMap: function (e) {
    var that = this
    that.setData({
      cnId: that.data.DeviceMapArray[e.detail.value].deviceMapId,
      deviceMapId: that.data.DeviceMapArray[e.detail.value].id,
      deviceMapTitle: that.data.DeviceMapArray[e.detail.value].title,
      ParamsArray: that.data.DeviceMapArray[e.detail.value].params
    })

  },

  searchDataMap: function (e) {
    var that = this
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/devicesetting/map/list',
      data: {
        deviceType: that.data.DeviceType,
        deviceFactory: that.data.DeviceFactory,
        deviceLine: that.data.DeviceLine,
        deviceAttr: that.data.DeviceAttr,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          DeviceMapArray: res.data.data
        })
      }
    })

  },
  bindDeviceAttr: function (e) {
    var that = this
    var DeviceAttr = that.data.DeviceAttrArray[e.detail.value].attr
    that.setData({
      DeviceAttr: DeviceAttr
    })
    that.searchDataMap()
  },
  bindDeviceLine: function (e) {
    var that = this
    var DeviceLine = that.data.DeviceLineArray[e.detail.value].line
    that.setData({
      DeviceLine: DeviceLine
    })
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/devicesetting/setting/list/attr',
      data: {
        line: DeviceLine
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          DeviceAttrArray: res.data.data
        })
        that.searchDataMap()
      }
    })
  },
  bindDeviceType: function (e) {
    var that = this
    var DeviceType = that.data.DeviceTypeArray[e.detail.value].typeName
    if(DeviceType=="PLC"){
      that.setData({
        prefix:2
      })
    }else{
      that.setData({
        prefix:1
      })
    }
    that.setData({
      DeviceType: DeviceType
    })
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/devicesetting/setting/list/factory',
      data: {
        deviceType: DeviceType
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          DeviceFactoryArray: res.data.data
        })
      }
    })
  },
  bindDeviceFactory: function (e) {
    var that = this
    var DeviceFactory = that.data.DeviceFactoryArray[e.detail.value].factory
    that.setData({
      DeviceFactory: DeviceFactory
    })
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/devicesetting/setting/list/line',
      data: {
        factory: DeviceFactory
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          DeviceLineArray: res.data.data
        })
      }
    })
  },
  onLoad: function () {
    var that = this
   
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/devicesetting/setting/list/type',
      data: {
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          DeviceTypeArray: res.data.data
        })
      }
    })


    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/devicesetting/setting/list/attr',
      data: {
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          DeviceAttrArray: res.data.data
        })
      }
    })


  },

})
