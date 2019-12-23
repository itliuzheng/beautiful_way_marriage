// Components/myToast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    noCode: {
      type: Boolean,
      value: false
    },
    otherdetail: {
      type: String,
      value: '您尚未注册,点击立即注册'
    },
    step: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideMask() {
      // this.setData({
      //   noCode:false
      // })
      wx.switchTab({
        url: '/pages/home/index',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    goloading() {
      if (!this.data.step.completeInfo) {
        wx.navigateTo({
          url: '/pages/myself/person_info/person_info',
        })
      } else if (!this.data.step.userAuth) {
        wx.navigateTo({
          url: '/pages/myself/my_certification/my_certification',
        })
      } else {
        wx.navigateTo({
          url: '/pages/home/index/',
        })
      }
    }
  }
})
