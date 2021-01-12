const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuShow: false,
    index1: null,
    show1: false,
    index2: null,
    show2: false,
    title: null,
    selectData: [],
    partcategoryList: [],
    partsubcategoryList: [{name:"请选择"}],
    auliliaryList: {
      amountOfUser: null,
      brandName: null,
      id: null,
      modelName: null,
      partCategoryId: null,
      partSubCategoryId: 1,
      productId: null,
      remarks: null,
      supplier: null
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      "auliliaryList.productId": options.productId,
    })
    if (options.title == "编辑") {
      wx.setNavigationBarTitle({
        title: '编辑辅机' 
      })
      let auliliaryList = JSON.parse(options.auliliaryList);
      that.setData({
        auliliaryList:auliliaryList,
        title: options.title,
      })
    }else{
      wx.setNavigationBarTitle({
        title: '添加辅机' 
      })
    }
   
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/partcategory/list',

      method: 'get',
      success: function (res) {
       
        if (that.data.title == "编辑") {
          let index = null
          let index1 = null
          for (let i = 0; i < res.data.data.length; i++) {
            if (that.data.auliliaryList.partCategoryId == res.data.data[i].id) {
              index = i
            }
          }
        
          that.setData({
            partcategoryList: res.data.data,
            index1: index
          })
         
          wx.request({
            //获取openid接口   
            url: app.globalData.webapi + '/webapi/enterprise/partsubcategory/list',
            data: {
              partCategoryId: that.data.auliliaryList.partCategoryId
            },
            method: 'get',
            success: function (res) {
              for (let i = 0; i < res.data.data.length; i++) {
                if (that.data.auliliaryList.partSubCategoryId == res.data.data[i].id) {
                  index1 = i
                }
              }
              that.setData({
                partsubcategoryList: res.data.data,
                index2: index1
              })
            }
          })
        }else{
          let arr = res.data.data
          let arr1 = { name: "请选择" }
          arr.push(arr1)
          that.setData({
            partcategoryList: arr,
            index1: arr.length - 1
          })
        }
      }
    })
   
  
  },
  

  selectTap1() {
    this.setData({
      show1: !this.data.show1
    });
  },
  selectTap2() {
    this.setData({
      show2: !this.data.show2
    });
  },

  // 点击下拉列表
  optionTap1(e) {
    let arr = []
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    if (e.currentTarget.dataset.bean.name == "请选择") {
      wx.showToast({
        title: '请选择大类',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.setData({
        "auliliaryList.partCategoryId": e.currentTarget.dataset.bean.id,
        index1: Index,
        show1: !this.data.show1
      });
    }
    let that=this
    wx.request({
      //获取openid接口   
      url: app.globalData.webapi + '/webapi/enterprise/partsubcategory/list',
      data: {
        partCategoryId: e.currentTarget.dataset.bean.id
      },
      method: 'get',
      success: function (res) {
        let arr = res.data.data
        let arr1 = { label: "请选择" }
        arr.push(arr1)
        if (that.data.index2 == null) {
          that.setData({
            partsubcategoryList: arr,
            index2: arr.length - 1
          })
        } else {
          that.setData({
            partsubcategoryList: arr,
          })
        }

      }
    })
  },
  optionTap2(e) {
    let arr = []
 
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
      this.setData({
        "auliliaryList.partSubCategoryId": e.currentTarget.dataset.bean.id,
        index2: Index,
        show2: !this.data.show2
      });
   
  },
  brandNameInput: function (e) {
    let that = this
    that.setData({
      "auliliaryList.brandName": e.detail.value,
    })
  },
  modelNameInput: function (e) {
 
    let that = this
    that.setData({
      "auliliaryList.modelName": e.detail.value,
    })
  },
  amountOfUserInput: function (e) {
  
    let that = this
    that.setData({
      "auliliaryList.amountOfUser": e.detail.value,
    })
  },
  remarksInput: function (e) {
  
    let that = this
    that.setData({
      "auliliaryList.remarks": e.detail.value,
    })
  },
  supplierInput: function (e) {
  
    let that = this
    that.setData({
      "auliliaryList.supplier": e.detail.value,
    })
  },
  quenyButton1: function () {
   
    let that = this
    if (that.data.title == "编辑") {
      wx.request({
        //获取openid接口   
        url: app.globalData.webapi + '/webapi/enterprise/productpartinfo/modify',
        data: that.data.auliliaryList,
        method: 'post',
        success: function (data) {
          wx.navigateBack({
            
          })
        }
      })
    } else {
     let arr=[]
      arr.push(that.data.auliliaryList)
      wx.request({
        //获取openid接口   
        url: app.globalData.webapi + '/webapi/enterprise/productpartinfo/create',
        data: arr,
        method: 'post',
        success: function (data) {
          wx.navigateBack({
          })
        }
      })
    }

  },
})
