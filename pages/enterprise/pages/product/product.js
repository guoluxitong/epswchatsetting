const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuShow: false,
    statusBarHeight: app.globalData.statusBarHeight,
    index: 0,
    show: false,
    index1: 0,
    show1: false,
    index2: 0,
    show2: false,
    index3: 0,
    show3: false,
    title: null,
    selectData: [],
    productType: [],
    fuelList: [],
    mediuList: [],
    product: {
      id: null,
      boilerNo: null,
      boilerName: null,
      serviceEndDate: null,
      serviceCycle: null,
      mark: null,
      saleDate: null,
      controllerNo: null,
      customerName: null,
      productCategoryId: null,
      tonnageNum: null,
      media: null,
      power: null,
      userId: app.globalData.enterprise.userId,
      isSell: null,
      productCategoryName: null
    },
    productList: [],
    productCategoryList: [],
    menulist: [
      {
        "id": "1",
        "url": "../../../images/customer/select.png",
        "title": "搜索",
      }
    ],
    mainmodel: {
      "url": "../../../images/customer/home.png",
      "title": "菜单",
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let that = this

    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/productcategory/list',
      method: 'get',
      success: function (res) {
        that.setData({
          productCategoryList: res.data.data,
        })
        wx.request({
          //获取openid接口   
          url: app.globalData.webapi + '/webapi/enterprise/product/search?pageNum=1&pageSize=100',
          data: that.data.product,
          method: 'post',
          success: function (data) {
            that.setData({
              productList: data.data.data.list,
            })
          }
        })
      }
    })

    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/customer/list',
      data: {
        pageNum: 1,
        pageSize: 1000
      },
      method: 'get',
      success: function (res) {
        let arr = res.data.data.list
        let arr1 = { name: "全部" }
        arr.push(arr1)
        that.setData({
          selectData: arr,
          index: arr.length - 1
        })
      }
    })
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/productcategory/list',

      method: 'get',
      success: function (res) {
        let arr = res.data.data
        let arr1 = { name: "全部" }
        arr.push(arr1)
        that.setData({
          productType: arr,
          index1: arr.length - 1
        })
      }
    })
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/dictionaryvalue/list',
      data: {
        type: "fuel"
      },
      method: 'get',
      success: function (res) {
        let arr = res.data.data
        let arr1 = { label: "全部" }
        arr.push(arr1)
        that.setData({
          fuelList: arr,
          index2: arr.length - 1
        })
      }
    })
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/dictionaryvalue/list',
      data: {
        type: "medium"
      },
      method: 'get',
      success: function (res) {
        let arr = res.data.data
        let arr1 = { label: "全部" }
        arr.push(arr1)
        that.setData({
          mediuList: arr,
          index3: arr.length - 1
        })
      }
    })

  },

  modalCancel: function () {
    this.setData({
      menuShow: false,
    })
  },
  menuItemClick: function (e) {
    if (e.detail.iteminfo.id == 1) {
      this.setData({
        menuShow: true,
      })
    }
  },

  controllerNoInput: function (e) {
    console.log(e.detail.value)
    let that = this
    that.setData({
      "product.controllerNo": e.detail.value,
    })
  },
  searchBtnClick: function () {
    let that = this
    that.setData({
      "product.userId": app.globalData.enterprise.userId,
    })
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/product/search?pageNum=1&pageSize=100',
      data: that.data.product,
      method: 'post',
      success: function (data) {
        that.setData({
          productList: data.data.data.list,
          menuShow: false
        })
      }
    })
  },

  productClick: function (e) {
    let that = this
    let index1
    let index2
    let index3
    for (let i = 0; i < that.data.productType.length; i++) {
      if (e.currentTarget.dataset.bean.productCategoryId == that.data.productType[i].id) {
        index1 = i
      }
    }
    for (let i = 0; i < that.data.fuelList.length; i++) {
      if (e.currentTarget.dataset.bean.power == that.data.fuelList[i].value) {
        index2 = i
      }
    }
    for (let i = 0; i < that.data.mediuList.length; i++) {
      if (e.currentTarget.dataset.bean.media == that.data.mediuList[i].value) {
        index3 = i
      }
    }
    let product = JSON.stringify(e.currentTarget.dataset.bean)

    wx.showActionSheet({
      itemList: ['编辑', "临时地图标注", "辅机信息", '删除'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../productadd/productadd?title=编辑&product=' + product + '&index1=' + index1 + '&index2=' + index2 + '&index3=' + index3,
          })
        }
        if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '../sale/sale?title=售出&product=' + product,
          })
        }
        if (res.tapIndex == 2) {
          wx.navigateTo({
            url: '../auxiliary/auxiliary?title=辅机&productId=' + e.currentTarget.dataset.bean.id + '&product=' + product,
          })
        }
        if (res.tapIndex == 3) {
          wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success: function (sm) {
              if (sm.confirm) {
                wx.request({
                  url: app.globalData.webapi + '/webapi/enterprise/product/remove',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    id: e.currentTarget.dataset.bean.id,
                    controllerNo: e.currentTarget.dataset.bean.controllerNo,
                  },
                  method: 'post',
                  success: function (data) {
                    if (data.data.code == 0) {
                      wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                      })
                      that.onShow();
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
