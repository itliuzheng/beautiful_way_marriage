
const config = require('../../../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:{
      frontImgSrc: '', 
      "frontImg": "string //身份证正面照  base64",
      "frontImgExt": "string //身份证正面照后缀",
      "backImg": "string //身份证反面照base64",
      "backImgExt": "string //身份证反面照后缀",
      backImgSrc:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  chooseImageFront() {
    let _this = this;

    wx.chooseImage({
      count: 1,
      // sizeType: 'original',

      sizeType: 'compressed',
      success: function (res) {
        let str = res.tempFilePaths[0];
        _this.setData({
          "img.frontImgSrc": str
        })

        let suffix = str.substring(str.lastIndexOf('.'));

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调

            _this.setData({
              "img.frontImg": res.data,
              "img.frontImgExt": suffix,
            })
          }
        })

      },
    })
  },
  chooseImageBack() {
    let _this = this;

    wx.chooseImage({
      count: 1,
      // sizeType: 'original',

      sizeType: 'compressed',
      success: function (res) {
        let str = res.tempFilePaths[0];
        _this.setData({
          "img.backImgSrc": str
        })

        let suffix = str.substring(str.lastIndexOf('.'));

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调

            _this.setData({
              "img.backImg": res.data,
              "img.backImgExt": suffix,
            })
          }
        })

      },
    })

  },
  bindFormSubmit(e){
    console.log(e.detail);
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
      name: e.detail.value.name,
      identityCard: e.detail.value.identityCard,
      frontImg: _this.data.img.frontImg,
      frontImgExt: _this.data.img.frontImgExt,
      backImg: _this.data.img.backImg,
      backImgExt: _this.data.img.backImgExt,
    }, `/auth/user`, (resp) => {
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