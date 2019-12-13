
const config = require('../../../utils/config.js');
let app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    list: null
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

  getInit(page = 1) {
    let that = this;

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
    }, (res) => {

    })
  },
})