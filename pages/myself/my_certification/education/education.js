
const config = require('../../../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: {
      imgSrc: '',
      "img": "string //学历证书照片 base64",
      "imgExt": "string //学历证书照片 后缀"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  chooseImage() {
    let _this = this;

    wx.chooseImage({
      count: 1,
      sizeType: 'original',
      success: function (res) {
        let str = res.tempFilePaths[0];
        _this.setData({
          "img.imgSrc": str
        })

        let suffix = str.substring(str.lastIndexOf('.'));

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调

            _this.setData({
              "img.img": res.data,
              "img.imgExt": suffix,
            })
          }
        })

      },
    })
  },
  bindFormSubmit(e) {
    console.log(e);
    let _this = this;

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
      openId: app.globalData.uid,
      img: _this.data.img.img,
      imgExt: _this.data.img.imgExt,
    }, `/auth/education`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        config.mytoast('认证成功', (res) => { });
        wx.navigateBack()
      } else {

        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })

  }
})