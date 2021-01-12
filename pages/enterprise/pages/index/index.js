const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    roleList:[],
   
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that=this
    //登录
    wx.login({
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        success: function (res) {
          var code = res.code; //返回code
         
          wx.request({
            url: app.globalData.webapi + '/wechat/device/getopenid',
            data: {js_code: res.code,},
            method: 'GET',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
            success: function (res) {
             
              app.globalData.enterprise.openId=res.data.openid
              wx.request({
                //获取openid接口   
                url: app.globalData.webapi + '/account/wechat/enterprise/openid',
                data: {
                  openId:res.data.openid
                },
                method: 'get',
                success: function (data) {
                  
                 
                  if (data.data.code== 0) {
                   app.globalData.enterprise.employeeId = data.data.data.employeeId 
                    wx.redirectTo({
                      url: '../boiler-index/boiler-index'
                    })
                  }
                  if (data.data.code == 1) {
                    wx.redirectTo({
                      url: '../login/login'
                    })
                  }
                }
              })
            }
          })
        }
    })
  },
  
  
})
