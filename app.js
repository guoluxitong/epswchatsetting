import './vendor/weapp-cookie/index'
App({
  onLaunch: function () {
    var that=this
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
                if (res.data.code == 1) {
                  wx.redirectTo({
                    url: '/pages/enterprise/pages/login/login'
                  })
                }else{
                  wx.getSetting({
                  success: res => {
                    if (res.authSetting['scope.userInfo']) {
                      wx.login({
                        success: function (res) {
                          var code = res.code;//登录凭证
                          if (code) {
                            //2、调用获取用户信息接口
                            wx.getUserInfo({
                              success: function (res) {
                                //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                                wx.request({
                                  url: 'https://apis.sdcsoft.com.cn/wechat/device/setting/getUnionId',
                                  method: 'get',
                                  header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                  },
                                  data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                                  success: function (data) {
                                    console.log(data.data.data.unionId)
                                    that.globalData.unionId = data.data.data.unionId
                                    that.globalData.enterprise.openId=data.data.data.openid
                                      
                                  },
                                  fail: function () {
                                    console.log('系统错误')
                                  }
                                })
                              },
                              fail: function () {
                                console.log('获取用户信息失败')
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
                    
            
                  }
                })}
              }
            })

          }
        })
      }
    })
    
  },
  globalData: {
    webapi:'http://localhost:8088', //'https://apis.sdcsoft.com.cn'
    userInfo: null,
    enterprise:{
      orgId: null,
      employeeId: null,
      userName: null,
      userId: null,
      openId: null,
      roleId: null,
      roleName: null,
      listResource: []
    }
  }
})