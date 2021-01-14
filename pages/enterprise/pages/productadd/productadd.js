const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    title: null,
    customers: [],
    product: {
      orgId: null,
      id: null,
      boilerNo: "",
      saleDate: null,
      mark: null,
      saleDate: null,
      controllerNo: "",
      customerId: null,
      customerName: "",
      productCategoryId: null,
      tonnageNum: "",
      media: null,
      power: null,
      createDateTime: null,
      editDateTime: null,
      userId: app.globalData.enterprise.userId,
      isSell: 1,
      productCategoryName: null,
      roleIdArray: {
        roleId: null, roleName: null
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.title == "编辑") {
      wx.setNavigationBarTitle({
        title: '编辑控制柜信息'
      })
      let product = JSON.parse(options.product);
      that.setData({
        product: product,
        title: options.title
      })

    } else {
      wx.setNavigationBarTitle({
        title: '添加锅炉'
      })
    }
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/customer/list?pageNum=1&pageSize=1000',
      method: 'get',
      success(res) {
        let customers = res.data.data.list
        let customerId = that.data.product.customerId
        let cindex = -1
        if (customerId) {
          for (let i in customers) {
            if (customers[i].id === customerId) {
              cindex = i
              break
            }
          }
        }
        that.setData({
          customers: res.data.data.list,
          index: cindex
        })
      }
    })
  },

  tonnageNumInput: function (e) {
    let that = this
    that.setData({
      "product.tonnageNum": e.detail.value,
    })
  },
  bindDateChange: function (e) {
    let that = this
    that.setData({
      "product.saleDate": e.detail.value,
    })
  },
  bindPickerChange(e) {
    let cusIndex = e.detail.value
    let customer = this.data.customers[cusIndex]
    this.setData({ index: cusIndex, 'product.customerId': customer.id, 'product.customerName': customer.name })
    console.log(this.data.product)
  },
  saveBtnClick() {
    let that = this
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/product/modify',
      data: that.data.product,
      method: 'post',
      success: function (data) {
        wx.navigateBack({
        })
      }
    })
  }
})
