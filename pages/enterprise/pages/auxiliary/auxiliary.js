const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    auliliaryList:[],
    markersList:[],
    repairDate:null,
    menulist: [
      {
        "pageUrl": "auxiliaryadd",
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
   product:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
 onShow:function(){
  let that=this
  wx.request({
    //获取openid接口   
    url: app.globalData.webapi + '/webapi/enterprise/productpartinfo/list',
    data: {
      productId: that.data.productId ,
    },
    method: 'get',
    success: function (res) {
      that.setData({
        auliliaryList: res.data.data,
      })
    }
  })
 },
  onLoad: function (options) {
    if(options.title=="辅机"){
      let product = JSON.parse(options.product);
      this.setData({
        product: product,
      })
    }
   
    var DATE = util.formatTime(new Date());
    var date = DATE.substring(0, 10);
    this.setData({
      repairDate: date,
    })
    let that=this
   
    that.setData({
      productId: options.productId,
    })
   
  },
  menuItemClick: function (e) {
   
    if (e.detail.iteminfo.id == 1) {
      wx.navigateTo({
        url: '../auxiliaryadd/auxiliaryadd?productId='+this.data.productId
      })
    }

  },
  Click1:function(e){
    let that =this
    let auliliaryList = JSON.stringify(e.currentTarget.dataset.bean)   
   
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../auxiliaryadd/auxiliaryadd?auliliaryList=' + auliliaryList+'&productId=' + that.data.productId+'&title=编辑',
          })
        }
        if (res.tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function (sm) {
              if (sm.confirm) {
                wx.request({
                  url: app.globalData.webapi + '/webapi/enterprise/productpartinfo/remove',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    productPartInfoId: e.currentTarget.dataset.bean.id,
                    productId: e.currentTarget.dataset.bean.productId,
                  },
                  method: 'post',
                  success: function (data) {
                    if (data.data.code == 0) {
                      wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                      })
                      wx.request({
                        //获取openid接口   
                        url: app.globalData.webapi + '/webapi/enterprise/productpartinfo/list',
                        data: {
                          productId: that.data.productId,
                        },
                        method: 'get',
                        success: function (res) {
                          that.setData({
                            auliliaryList: res.data.data,
                          })
                        }
                      })
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
})
