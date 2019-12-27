// pages/login/index.js
const config = require('../../utils/config.js');
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.url){
      this.setData({
        type: options.url
      })
    }
  },
  onUnload:function(){
    // if (this.data.type == 'back_home') {
    //   wx.reLaunch({
    //     url: '/pages/myself/myself?url=back_home'
    //   }) 
    // }
  },
  /**
   * 保存用户头像
   */
  savaUserInfo() {
    config.ajax('POST', {
      openId: app.globalData.uid,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName,
      gender: app.globalData.userInfo.gender,
      province: app.globalData.userInfo.province,
      city: app.globalData.userInfo.city,
      country: app.globalData.userInfo.country
    }, config.saveInfo, (res) => {
      if (res.data.msg == "成功") {
        wx.redirectTo({
          url: '/pages/login/login/login'
        })
      }
    }, (res) => {

    })
  },
  /**
   * 获取用户信息
   */
  onGotUserInfo(e) {
    console.log(e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    config.getuid((res) => {
      console.log('onGotUserInfo---', res);
      if (res.data.code == 1) {
        app.globalData.uid = res.data.data
        this.savaUserInfo()
      } else {
        config.mytoast('服务器错误,请稍后再试', (res) => { })
      }
    }, (res) => { })
  }
})