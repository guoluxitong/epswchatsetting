const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterpriseList: [],
    enterpriseIndex: -1,
    enterpriseId: -1,
    customerList: [],
    customerIndex: -1,
    customerId: -1,
    lastDeviceNo: "",
    codeList: [],
    codeIndex: -1,
    code: "",
    startNo: "",
    endNo: "",
    super: false,
  },
  submit() {
    var that = this

    if (that.data.startNo == "" || that.data.endNo == "") {
      wx.showToast({
        title: "所开编号不能为空",
        icon: 'none',
        duration: 5000
      });
      return
    }
    var startNo = that.data.startNo
    var endNo = that.data.endNo
    if (startNo.length < 5) {
      var num = 5 - startNo.length
      var prefix = "";
      for (var i = 0; i < num; i++) {
        prefix += "0"
      }
    }
    startNo = that.data.code + prefix + startNo
    if (endNo.length < 5) {
      var num = 5 - endNo.length
      var prefix = "";
      for (var i = 0; i < num; i++) {
        prefix += "0"
      }
    }
    endNo = that.data.code + prefix + endNo


    startNo = Number(startNo) - 1
    endNo = Number(endNo)
    var deviceList = []
    var length = endNo - startNo
    var deviceNo = "0" + endNo.toString()
    for (var i = 0; i < length; i++) {
      startNo++
      deviceList.push({
        deviceNo: "0" + startNo.toString(),
        deviceSuffix: "0" + startNo.toString(),
        deviceType: "CTL_NJZJ_IPK2",
        enterpriseId: that.data.enterpriseId,
        subType: "CTL_NJZJ_IPK2",
      })
    }
    console.log(deviceNo)
    wx.request({
      url: app.globalData.webapi + '/webapi/datacenter/core/device/create/wechat',
      method: "POST",
      data: {
        deviceList: JSON.stringify(deviceList),
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          wx.setClipboardData({
            data: deviceNo,
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  wx.showToast({
                    title: '设备编号已复制'
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  inputStartNo(e) {
    var that = this
    that.setData({
      startNo: e.detail.value,
      endNo: e.detail.value
    })
  },
  inputEndNo(e) {
    var that = this
    that.setData({
      endNo: e.detail.value
    })
  },

  bindCodeChange: function (e) {
    var that = this
    var index = e.detail.value
    that.setData({
      code: that.data.codeList[index].code,
      lastDeviceNo: that.data.codeList[index].lastDeviceNo,
      codeIndex: index
    });

  },
  bindCustomerChange: function (e) {
    var that = this
    var index = e.detail.value
    var customerId = that.data.customerList[index].id
    that.setData({
      customerId: customerId,
      customerIndex: index
    });
    wx.request({
      url: app.globalData.webapi + '/webapi/datacenter/core/enterprise/customer/prefix/list',
      method: "GET",
      data: {
        enterpriseCustomerId: customerId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          codeList: res.data.data
        });
      }
    })
  },
  bindEnterpriseChange: function (e) {
    var that = this
    var index = e.detail.value
    var enterpriseId = that.data.enterpriseList[index].id
    that.setData({
      enterpriseId: enterpriseId,
      enterpriseIndex: index
    });
    wx.request({
      url: app.globalData.webapi + '/webapi/datacenter/core/enterprise/customer/list',
      method: "GET",
      data: {
        enterpriseId: enterpriseId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          customerList: res.data.data
        });
      }
    })
  },
  
  onLoad: function (options) {
    var that = this
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口  
          url: 'https://apis.sdcsoft.com.cn/wechat/device/setting/getopenid',
          data: {
            js_code: res.code,
          },
          method: 'GET',
          success: function (res) {
            var openid = res.data.openid
            wx.request({
              //获取openid接口 
              url: 'https://apis.sdcsoft.com.cn/webapi/enterprise/user/find/openId',
              data: {
                openId: openid,
              },
              method: 'GET',
              header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              },
              success: function (res) {
                console.log(res)
                var orgId = res.data.data.orgId
                var unionId=res.data.data.unionId
                app.globalData.enterprise.orgId=orgId
                that.setData({
                  enterpriseId: orgId
                })
                if (orgId == 1000007) {
                  that.setData({
                    super: true
                  })
                }
                wx.request({
                  url: app.globalData.webapi + '/wechat/employee/find/unionId',
                  method: "GET",
                  data: {
                    unionId: unionId,
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    console.log(res)
                    wx.request({
                      url: app.globalData.webapi + '/account/datamanage/login',
                      method: "POST",
                      data: {
                        loginId: res.data.data.mobile,
                        password:res.data.data.password
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        wx.request({
                          url: app.globalData.webapi + '/webapi/datacenter/core/enterprise/list',
                          method: "GET",
                          data: {
                          },
                          success: function (res) {
                            that.setData({
                              enterpriseList: res.data.data
                            })
                          }
                        })
                        wx.request({
                          url: app.globalData.webapi + '/webapi/datacenter/core/enterprise/customer/list',
                          method: "GET",
                          data: {
                            enterpriseId: orgId,
                          },
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          success: function (res) {
                            that.setData({
                              customerList: res.data.data
                            });
                          }
                        })
                      }
                    })
                  }
                })     
             
              }
            })

          }
        })
      }
    })
    
    wx.getSetting({
      success: res => {
        console.log(res)
        wx.login({
          success: function (res) {
            var code = res.code;//登录凭证
            if (code) {
              //2、调用获取用户信息接口
              wx.getUserInfo({
                success: function (res) {
                  //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                  wx.request({
                    url: app.globalData.webapi + '/wechat/device/setting/getUnionId',
                    method: 'get',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                    success: function (data) {
                      var unionId = data.data.data.unionId
                      wx.request({
                        url: app.globalData.webapi + '/wechat/employee/find/unionId',
                        method: "GET",
                        data: {
                          unionId: unionId,
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                          console.log(res)
                          app.globalData.enterprise.userId=res.data.data.userId
                          app.globalData.enterprise.roleId=res.data.data.roleId
                          app.globalData.enterprise.roleName=res.data.data.orgId
                          app.globalData.enterprise.orgId=res.data.data.orgId
                          
                        }
                      })

                    },
                    fail: function (ee) {
                      console.log('系统错误')
                      console.log(ee)
                    }
                  })
                },
                fail: function (eee) {
                  console.log(eee)
                }
              })

            } else {
              console.log('获取用户登录态失败！' + r.errMsg)
            }
          },
          fail: function () {
            console.log('登陆失败')
          }
        })
      }
    })
    
  },


})