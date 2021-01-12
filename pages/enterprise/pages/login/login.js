//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    timeText: '获取验证码', //倒计时 
    timeNum:'',
    seconds: "", 
    timer: '' ,
    name: '',
    unionId:"",
    verificationCode:null,
    yanzheng:"qwer",
    referralCode:"",
    phone: '',
    empower:true,
    getCode: false
  },
  //事件处理函数
  onShow: function () { 
    
    var that = this
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
                      url: app.globalData.webapi + '/wechat/device/setting/getUnionId',
                      method: 'get',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                      success: function (data) {
                        that.setData({
                          unionId:data.data.data.unionId
                          })
                          app.globalData.unionId = data.data.data.unionId
                          app.globalData.enterprise.openId=data.data.data.openid
                          wx.redirectTo({
                            url: '../boiler-index/boiler-index'
                          })
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
        } else {
         that.setData({
          empower:false
         })
        }

      }
    })
  
   },
  bindGetUserInfo: function (e) {
    var that = this
    that.setData({
      empower:true
    })
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
                      url: app.globalData.webapi + '/wechat/device/setting/getUnionId',
                      method: 'get',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                      success: function (data) {
                        var unionId = data.data.data.unionId
                        app.globalData.unionId = unionId
                        app.globalData.enterprise.openId=data.data.data.openid
                        that.setData({
                          unionId:data.data.data.unionId,
                          empower:true
                          })
                        console.log(unionId)
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

        } else {
          console.log('获取用户信息失败')
        }

      }
    })
  },
  refusedEmpower: function () {
    wx.navigateTo({
      url: '../../../welcome/welcome'
    })
  },
  getNewCode: function () {
    let that=this
    if (!(/^1[34578]\d{9}$/.test(that.data.phone))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 2000
      })
    
  } 
   else if(that.data.phone==""||that.data.phone==null){
       wx.showToast({
                        title:  "请输入手机号",
                        icon:  'none',
                        duration:  2000
                    });
    }else{
      wx.request({
                  url:  app.globalData.webapi + '/wechat/user/reg/sms/zh',
                  method:  "GET",
                  data:  {
                    number:that.data.phone
                  },
                  header:  {
                      'content-type':  'application/x-www-form-urlencoded'
                  },
                  success:  function  (res)  {
                      if  (res.data.code == 1) {
                          wx.showToast({
                              title:  "发送失败",
                              icon:  'none',
                              duration:  2000
                          });
                      } else {
                          that.setData({
                              verificationCode:  res.data.data
                          })
                          wx.showToast({
                              title:  "短信验证码已发送",
                              icon:  'none',
                              duration:  2000
                          });
                      }
                  }
              })
      
      // 开始倒计时
      that.setData({ 
        getCode: true,
        seconds: 60,
        timer: setInterval(function(){
          let seconds = that.data.seconds
          that.setData({ seconds: seconds - 1 })
          if (that.data.seconds == 0) {
            // 读秒结束 清空计时器
            clearInterval(that.data.timer)
            that.setData({
              getCode: false,
              seconds: "",
            })
          }
        }, 1000)
      })
    }
  },
  nameInput: function (e) {
    let that = this
    that.setData({
      name: e.detail.value,
    })
  },
  referralCodeInput: function (e) {
    let that = this
    that.setData({
      referralCode: e.detail.value,
    })
  },
  loginPhone: function (e) {
    let phone = e.detail.value;
   
      this.setData({
        phone: phone
      })
    
  },
  yanZhengInput: function (e) {
   
    var that = this;
    var yanzheng = e.detail.value;
    that.setData({
      yanzheng: yanzheng,
    })
   
  },
  addButton:function(){
   let that=this
    if (that.data.yanzheng == that.data.verificationCode) {
      wx.request({
        //获取openid接口   
        url: app.globalData.webapi + '/webapi/enterprise/user/create',
        data: {
          invCode: that.data.referralCode,
          openId: app.globalData.enterprise.openId,
          userName: that.data.name,
          unionId:that.data.unionId,
          mobile: that.data.phone
        },
        method: 'post',
        success: function (data) {
          if(data.data.code==0){
            wx.switchTab({
              url: '../../../index/index'
            })
          }else{
            wx.showToast({
              title: "认证失败",
              icon: 'success',
              duration: 2000
            })
          }
         
        }
      })
      } else {
      wx.showToast({
        title: '输入验证码有误',
        icon: 'none',
        duration: 2000
      })
      }
  }
})
