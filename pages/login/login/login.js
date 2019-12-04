// pages/login/login/login.js
const config = require('../../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formSubmit(e) {
    let form = e.detail.value;
    console.log(form);
    if (form.loginName == '') {
      config.mytoast('手机号不能为空', (res) => { })
      return false
    }
    if (form.password == '') {
      config.mytoast('密码不能为空', (res) => { })
      return false
    }

    config.ajax('POST', {
      openId: app.globalData.uid,
      loginName: form.loginName,
      password: form.password
    }, config.userlogin, (res) => {
      console.log(res.data);

      if (res.data.code == 1) {
        wx.setStorageSync('token', res.data.data)
        wx.switchTab({
          url: '/pages/home/index'
        })
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })

  },
})