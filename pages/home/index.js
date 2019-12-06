// pages/home/index.js
const config = require('../../utils/config.js');
let app = getApp()
let timer = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: [],
    userRecommend: [],
    annualIncomeArray: ['3-8万', '8-12万', '12-20万', '20-30万', '30-100万', '100万以上'],
    hasUserInfo:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    noCode: false,
    info:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let token = wx.getStorageSync('token') || null;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

      console.log('hasUserInfo-1--', this.data.hasUserInfo);

      console.log('token=1==', token);

      if (!token) {
        wx.navigateTo({
          url: '/pages/login/login/login'
        })
      }
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        console.log('hasUserInfo-2--', this.data.hasUserInfo);

        console.log('token=2==', token);

        if (this.data.hasUserInfo == false) {
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
        if (!token) {
          wx.navigateTo({
            url: '/pages/login/login/login'
          })
        }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
      })
      console.log('hasUserInfo-3--', this.data.hasUserInfo);

      console.log('token=3==', token);

      if (this.data.hasUserInfo == false) {
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }

      if (!token) {
        wx.navigateTo({
          url: '/pages/login/login/login'
        })
      }
    }


    timer = setTimeout(function () {
      console.log('hasUserInfo-4--', _this.data.hasUserInfo);

      if (_this.data.hasUserInfo == false) {
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
      if (!token) {
        wx.navigateTo({
          url: '/pages/login/login/login'
        })
      }
    }, 2000)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInit();
    this.getBanner();
    this.getUserRecommend()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getInit() {

    let _this = this;

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('GET', {
    }, `/auth/status`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          info: res.data
        })
        if (!res.data.completeInfo || !res.data.userAuth) {
          this.setData({
            noCode: true
          })
        } else {
          this.setData({
            noCode: false
          })

        }

      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  
  getBanner() {

    config.ajax('POST', {

    }, config.getBanner, (res) => {
      console.log(res.data);

      if (res.data.code == 1) {
        this.setData({
          background: res.data.data.data
        });
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })
  },
  getUserRecommend() {

    config.ajax('POST', {
        pageSize:3,
        pageNum:1
    }, `/user/page`, (resp) => {
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          userRecommend: res.data
        });
      } else {
        config.mytoast(res.msg, (res) => { })
      }
    }, (res) => {

    })
  },
})