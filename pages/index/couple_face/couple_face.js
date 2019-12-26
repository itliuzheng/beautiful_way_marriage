
const config = require('../../../utils/config.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  add_upload(){
    // let dom = {
    //   img:1,
    //   choose:false
    // };
    // let _this = this;
    // let arr = _this.data.upload_list;

    // if(arr.length <= 7){
    //   arr.push(dom);
    //   this.setData({
    //     upload_list: arr
    //   })
    // }

    let _this = this;

    wx.chooseImage({
      count: 8,
      // sizeType: 'original',
      sizeType: 'compressed',
      success: function (res) {
        let arrImg = res.tempFilePaths;
        let photos = [];
        arrImg.forEach((value, index) => {
          wx.getFileSystemManager().readFile({
            filePath: value, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              photos.push({
                url: value,
                img: res.data,
                imgExt: value.substring(value.lastIndexOf('.')),
                choose:false
              })
              // if (index == arrImg.length - 1) {
              //   _this.uploadImg(photos)
              // }

              _this.setData({
                upload_list: photos
              })
            }
          })
        })
      },
    })
  },
  uploadImg(photos) {

    let _this = this;
    wx.showLoading({
      title: '图片上传中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
      photos: photos
    }, `/personal/photo-album/add`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {
        _this.getPhotos();
        config.mytoast(res.msg, (res) => { });
      } else {
        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })
  },
  choose(e) {
    let _index = e.currentTarget.dataset.index;
    let arr = this.data.upload_list;
    arr.forEach((value,index)=>{
      if (index == _index ){
        value.choose = true
      }else{
        value.choose = false
      }
    })

    this.setData({
      upload_list:arr
    })
  },
  toMatch(){
    let boolean = false;
    let arr = this.data.upload_list;
    arr.forEach((value, index) => {
      if (value.choose) {
        boolean = true;
      }
    })

    if (!boolean) {
      config.mytoast('请选择一张照片', (res) => { });
      return false;
    }

    wx.navigateTo({
      url: '/pages/index/list/list?url=sysMatch',
    })
  }
})