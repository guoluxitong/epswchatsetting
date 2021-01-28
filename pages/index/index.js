//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
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
   cnId: "",
    deviceMapTitle: "",
    DeviceMapArray: [],
    ParamsArray: [],
    params: [],
    stationNo: "",
    deviceNo: "",
    sn:"",
    sim:"",
    canctlarray: ["不可控", "可控"],
    canctl: 0,
    power:0,
    media:0,
    canctl:0,
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
    if (that.data.params.length == 0) {
      wx.showToast({
        title: "请配置参数",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.stationNo == '') {
      wx.showToast({
        title: "站号不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    }
   
    wx.request({
      url: app.globalData.webapi + '/wechat/device/modify',
      data: {
        power: that.data.power,
        media: that.data.media,
        prefix: that.data.prefix,
        deviceNo: that.data.deviceNo,
        status: 1,
        iMEI: that.data.sim,
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
          wx.request({
            //获取openid接口   
            url: app.globalData.webapi + '/devicesetting/setting/create',
            data: {
              deviceMapId: that.data.deviceMapId,
              deviceMapTitle: that.data.deviceMapTitle,
              params: that.data.params,
              deviceNo: that.data.deviceNo,
              stationNo: that.data.stationNo,
            },
            method: 'POST',
            success: function (res) {
              wx.request({
                //获取openid接口   
                url: app.globalData.webapi + '/devicesetting/setting/get',
                data: {
                  deviceNo: that.data.deviceNo
                },
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                success: function (res) { 
                  if (res.data.code == 1) {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  } else {
                    var atString = res.data.data
                    wx.request({
                      //获取openid接口   
                      url: 'https://wx.dtu.aichaowei.com/api/setting/create?signKey=5dc91732cf6525c80c9794dd',
                      data: {
                        atString: atString,
                        deviceNo:  that.data.deviceNo,
                        sn:  that.data.sn
                      },
                      header: {
                        "Content-Type": "application/json"
                      },
                      method: 'POST',
                      success: function (res) {
                        console.log(res)
                        if (res.data.code == 1) {
                          wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                          })
                        } else {
                          wx.showToast({
                            title: res.data.message,
                            icon: 'success',
                            duration: 2000
                          })
                          wx.request({
                            //获取openid接口   
                            url: app.globalData.webapi + '/webapi/enterprise/product/search?pageNum=1&pageSize=5',
                            data: {
                              boilerNo: "",
                              controllerNo: that.data.deviceNo,
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
                                    "product.boilerNo":that.data.DeviceType+"_"+that.data.DeviceFactory+"_"+that.data.DeviceLine+"_"+that.data.DeviceAttr,
                                    "product.controllerNo":that.data.deviceNo,
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
                                   console.log(123)
                                    }
                                  })
                                }
                      
                              }
                      
                          })
                        
                        }
                      }
                    })
                  }
                },
                fail: function (res) {
                }
              })
            }
          })
      
        }else{
          wx.showToast({
            title: 'Sim卡号不存在，请联系管理员',
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
  snInput: function (e) {
    var that = this
    that.setData({
       sn: e.detail.value
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
    var name =e.currentTarget.dataset.name
    if(name=='设备编号'){
      that.setData({
        deviceNo: e.detail.value
      })
    }
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
    var deviceDataMap=JSON.parse(that.data.DeviceMapArray[e.detail.value].deviceDataMap)

    if(deviceDataMap.no){
      that.setData({
        canctl: 1,
      })
    }
    if(deviceDataMap.media.v){
      that.setData({
        media: deviceDataMap.media.v,
      })
    }
    if(deviceDataMap.power.v){
      that.setData({
        power: deviceDataMap.power.v,
      })
    }
  
  
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
      DeviceAttr: DeviceAttr,
      deviceMapTitle:""
    })
    that.searchDataMap()
    
  },
  bindDeviceLine: function (e) {
    var that = this
    var DeviceLine = that.data.DeviceLineArray[e.detail.value].line
    that.setData({
      DeviceLine: DeviceLine,
      DeviceAttr:"",
      deviceMapTitle:"",
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
      DeviceType: DeviceType,
      DeviceFactory:"",
      DeviceLine:"",
      DeviceAttr:"",
      deviceMapTitle:"",
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
      DeviceFactory: DeviceFactory,
      DeviceLine:"",
      DeviceAttr:"",
      deviceMapTitle:"",
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
  
    //  wx.request({
    //   //获取openid接口   
    //   url: app.globalData.webapi + '/devicesetting/map/deviceMapId',
    //   data: {
    //     deviceMapId: "5fb5d12eca780f0026203e51"
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(typeof(res.data.data.deviceDataMap))
    //     console.log(typeof(res.data.data.pointIndexMap))
    //   }
    // })
  
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
