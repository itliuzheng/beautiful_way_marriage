// pages/myself/setting/setting.js
const config = require('../../../utils/config.js');
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    switchChecked:true,
    STATUS: null,
    noCode: false
  },
  ready:function(){
    this.getStatus();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    not_open_yet() {

      config.mytoast('暂未开放，敬请期待...', (res) => { });
    },
    edit() {
      this.setData({
        noCode: true
      })

    },
    cancel() {
      this.setData({
        noCode: false
      })
    },
    addSelfIntroduce(e) {

      console.log(e.detail);
      if (!e.detail.value.remark){
        config.mytoast('注销原因不能为空', (res) => { })
        return false;
      }

      wx.showLoading({
        title: '资料注销中...',
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })


      config.ajax('POST', {
        remark: e.detail.value.remark
      }, `/user/unsubscribe`, (res) => {
        wx.hideLoading();
        if (res.data.code == 1) {
          config.mytoast('资料注销成功，正在跳转...', (res) => { })

          // wx.setStorageSync('token', null)
          // wx.navigateTo({
          //   url: '/pages/login/index',
          // })
          wx.navigateBack({})
        } else {
          config.mytoast(res.data.msg, (res) => { })
        }
      }, (res) => {

      })
    },
    switchChecked(e){
      let value = e.detail.value;


      if (!this.data.STATUS.completeInfo) {
        config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });

        this.setData({
          switchChecked: !value
        })

        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/myself/person_info/person_info',
          })
        }, 500)
        return false;
      }
      if (this.data.STATUS.userAuth != 1) {
        config.mytoast('您尚未实名认证，请前往认证！', (res) => { });
        this.setData({
          switchChecked: !value
        })

        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/myself/my_certification/my_certification',
          })
        }, 500)
        return false;
      }

      if (!this.data.STATUS.vipLevel) {
        config.mytoast('请购买会员后查看~', (res) => { });

        this.setData({
          switchChecked: !value
        })

        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/myself/member/member',
          })
        }, 500)
        return false;
      }


    },
    getStatus() {

      let _this = this;

      config.ajax('GET', {
      }, `/auth/status`, (resp) => {
        let res = resp.data;
        if (res.code == 1) {
          this.setData({
            STATUS: res.data
          })

        } else {
          config.mytoast(res.msg, (res) => { });
        }
      }, (res) => {

      })

    },

  },
})
