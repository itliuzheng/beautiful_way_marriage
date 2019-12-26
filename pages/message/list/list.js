const config = require('../../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    info: null,
    expectMarriedArray: ['半年内', '一年内', '两年内'],
    list: null,
    show: true,
    isShow_wx: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name);
    let title = '';
    let url = '';
    if (options.name == 'liked'){
      title = '心动列表'
      url = '/like/page'
    } else if (options.name == 'see_who') {
      title = '我看过谁'
      url = '/visit/visit-record/visitOther'
    } else if (options.name == 'who_see') {
      title = '谁看过我'
      url = '/visit/visit-record/visitMe'
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({
      url: url
    })
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
    this.getStatus();
    this.getInit();

  },

  /**
   * 页面下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();

    this.getInit();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.list.current < this.data.list.pages) {
      let page = this.data.list.current + 1;
      this.getInit(page);
    }
  },

  getStatus() {

    let _this = this;
    config.ajax('GET', {
    }, `/auth/status`, (resp) => {
      let res = resp.data;
      if (res.code == 1) {
        this.setData({
          info: res.data
        })
      } else {
        // config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  },
  isVip(e) {
    let id = e.currentTarget.dataset.id;
    if (this.data.info.vipLevel) {
      let url = `/pages/introduction/introduction?id=${id}`
      wx.navigateTo({
        url: url,
      })
    } else {
      config.mytoast('您还不是会员，暂不能查看他/她的个人信息', (res) => { })
      wx.navigateTo({
        url: '/pages/myself/member/member',
      })
    }
  },
  getInit(page = 1) {
    let that = this;

    this.setData({
      show: true
    })
    config.ajax('POST', {
      pageNum:page
    }, that.data.url, (resp) => {
      let res = resp.data;

      if (res.code == 1) {
        if (page != 1) {
          this.data.list.data.push.apply(this.data.list.data, res.data.data);
          this.data.list.current = res.data.current;

          that.setData({
            list: that.data.list
          })
        } else {
          that.setData({
            list: res.data
          })

        }
      } else {
        config.mytoast(res.msg, (res) => { })
      }
      that.setData({
        show: false
      })
    }, (res) => {

      that.setData({
        show: false
      })
    })
  },
  showWx() {

    var token = wx.getStorageSync('token')
    if (!app.globalData.userInfo) {
      config.mytoast('您还未登录，请先登录', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }, 500)
      return false;
    }
    if (!token) {
      config.mytoast('您还未登录，请先登录', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/login/login',
        })
      }, 500)
      return false;
    }
    if (!this.data.info.completeInfo) {
      config.mytoast('您尚未完善个人资料，请前往填写！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/person_info/person_info',
        })
      }, 500)
      return false;
    }
    if (this.data.info.userAuth != 1) {
      config.mytoast('您尚未实名认证，请前往认证！', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/my_certification/my_certification',
        })
      }, 500)
      return false;
    }
    if (!this.data.info.vipLevel) {
      config.mytoast('请购买会员后查看~', (res) => { });
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/myself/member/member',
        })
      }, 500)
      return false;
    }

    this.setData({
      isShow_wx: true
    })
  },
  closeMask() {
    this.setData({
      isShow_wx: false
    })

  },
})