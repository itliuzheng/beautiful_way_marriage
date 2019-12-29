// pages/login/register/register.js
const config = require('../../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    phone: '点击右侧按钮'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getPhoneNumber(e) {
    config.ajax('POST', {
      openId: app.globalData.uid,
      encriptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    }, config.getWXPhone, (res) => {

      console.log(res.data);
      if (res.data.code == 1) {
        this.setData({
          phone: res.data.data
        })
      }
    }, (res) => {

    })
  },
  formSubmitRegister(e) {
    let form = e.detail.value;
    console.log(form);
    if (this.data.phone == '' || this.data.phone == '点击右侧按钮') {
      config.mytoast('手机号不能为空', (res) => { })
      return false
    }
    if (form.password == '') {
      config.mytoast('密码不能为空', (res) => { })
      return false
    }
    if (form.password != form.config_password) {
      config.mytoast('密码不一致，请重新输入', (res) => { })
      return false
    }

    config.ajax('POST', {
      openId: app.globalData.uid,
      phone: this.data.phone,
      // phone: form.phone,
      password: form.password,
      sources: '微信小程序'
    }, config.register, (res) => {

      console.log(res.data);
      if (res.data.code == 1) {

        config.mytoast('注册成功，正在跳转', (res) => { })

        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/login/login/login'
          })
        }, 1000)
      } else {
        config.mytoast(res.data.msg, (res) => { })
      }
    }, (res) => {

    })

  }
})