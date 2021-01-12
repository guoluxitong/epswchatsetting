const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    productcategoryList:[],
  
    menulist: [
      {
        "pageUrl": "boiler-modeladd",
        "id": "1",
        "url": "../../../images/customer/add.png",
        "title": "添加",
      },

    ],
    mainmodel: {
      "url": "../../../images/customer/home.png",
      "title": "菜单",
    },
    productId:null,
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let that=this
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/productcategory/pagelist',
      data: {
        total: 100, pageNum: 1, pageSize: 100, orgId: app.globalData.enterprise.orgId,
      },
      method: 'get',
      success: function (res) {
        that.setData({
          productcategoryList: res.data.data.list,
        })
      }
    })
  },
  menuItemClick: function (e) {
   
    if (e.detail.iteminfo.id == 1) {
      wx.navigateTo({
        url: '../boiler-modeladd/boiler-modeladd'
      })
    }

  },
  Click1:function(e){
    let that =this
    let productcategory = JSON.stringify(e.currentTarget.dataset.bean)   
   
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../boiler-modeladd/boiler-modeladd?productcategory=' + productcategory+'&title=编辑',
          })
        }
        if (res.tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function (sm) {
              if (sm.confirm) {
                wx.request({
                  url: app.globalData.webapi + '/webapi/enterprise/productcategory/deleteboilermodelbyid',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    id: e.currentTarget.dataset.bean.id,
                  },
                  method: 'post',
                  success: function (data) {
                    if (data.data.code == 0) {
                      wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                      })
                     that.onShow()
                    } else {
                      wx.showToast({
                        title: data.data.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
      
                  },
                })
                } else if (sm.cancel) {
                  wx.showToast({
                    title: '已取消',
                    icon: 'success',
                    duration: 2000
                  })
                }
              }
            })
        
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  navbarTap: function () {
    wx.navigateTo({
      url: '../boiler-index/boiler-index'
    })
  },
})
