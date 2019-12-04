//app.js
const config = require('/utils/config.js');
App({
  onLaunch: function () {
    var token = wx.getStorageSync('token') || []

    // 登录
    config.getuid((res) => {
      console.log(res);
      if (res.data.code == '1') {
        this.globalData.uid = res.data.data
      } else {
        config.mytoast('服务器错误,请稍后再试', (res) => { })
      }
    }, (res) => { })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    uid: null,
    _ishua: true,
    shareInfo: {
      title: '美途等您',
      path: '/pages/home/index',
      imageUrl: ''
    }
  }
})