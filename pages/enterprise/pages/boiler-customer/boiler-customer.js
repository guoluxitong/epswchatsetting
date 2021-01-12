//logs.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    title: null,
    index: 0,
    show: false,
    customerName: "",
    customerList: [],
    customer: {
      address: null,
      city: null,
      customerNo: null,
      district: null,
      id: null,
      name: null,
      orgId: null,
      phone: null,
      province: null,
    },
    menulist: [
      {
        "pageUrl": "boiler-customeradd",
        "id": "0",
        "url": "../../../images/customer/add.png",
        "title": "添加",
      },

    ],
    mainmodel: {
      "url": "../../../images/customer/home.png",
      "title": "菜单",
    }
  },
  onShow: function () {
    let that = this
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/customer/list',
      data: {
        pageNum: 1,
        pageSize: 100,
      },
      method: 'get',
      success: function (res) {
        that.setData({
          customerList: res.data.data.list
        })
      }
    })
  },
  menuItemClick: function (e) {
    if (e.detail.iteminfo.id == 0) {
      wx.navigateTo({
        url: '../boiler-customeradd/boiler-customeradd?title=添加'
      })
    }

  },
  customerClick(e) {
    let that = this
    let customer = JSON.stringify(e.currentTarget.dataset.bean)
    wx.showActionSheet({
      itemList: ['编辑'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../boiler-customeradd/boiler-customeradd?title=编辑&customer=' + customer,
          })
        }
        // if (res.tapIndex == 1) {
        //   wx.showModal({
        //     title: '提示',
        //     content: '确定要删除吗？',
        //     success: function (sm) {
        //       if (sm.confirm) {
        //         wx.request({
        //           url: app.globalData.webapi + '/webapi/boilermanage/enterprise/remove',
        //           header: {
        //             "Content-Type": "application/x-www-form-urlencoded"
        //           },
        //           data: {
        //             id: e.currentTarget.dataset.bean.id,
        //           },
        //           method: 'post',
        //           success: function (data) {
        //             if (data.data.code == 0) {
        //               wx.showToast({
        //                 title: '删除成功',
        //                 icon: 'success',
        //                 duration: 2000
        //               })
        //               that.onShow();
        //             } else {
        //               wx.showToast({
        //                 title: data.data.msg,
        //                 icon: 'none',
        //                 duration: 2000
        //               })
        //             }

        //           },
        //         })
        //       } else if (sm.cancel) {
        //         wx.showToast({
        //           title: '已取消',
        //           icon: 'success',
        //           duration: 2000
        //         })
        //       }
        //     }
        //   })
        // }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
})
