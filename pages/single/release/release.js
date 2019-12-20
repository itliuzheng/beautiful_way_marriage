// pages/single/release/release.js
const config = require('../../../utils/config.js');
const amapFile  = require('../../../component/libs/amap-wx.js');
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    upload_list: [],
    latitude:'',
    longitude:'',
    address_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  bindFormSubmit(e){
    console.log(e.detail);
    let type = e.detail.target.dataset.type;
    if(type == 'release'){
      //发布
      
      this.releaseAjax(e.detail.value.description,2);

    }else{
      //草稿
      this.releaseAjax(e.detail.value.description, 1);

    }
  },
  releaseAjax(description, status){
    let _this = this;

    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    config.ajax('POST', {
      openId:app.globalData.uid,
      singleCircleImg: _this.data.upload_list,
      description: description,
      latitude: _this.data.latitude,
      longitude: _this.data.longitude,
      status: status,
      address: _this.data.address_name
    }, `/circle/single-circle/add`, (resp) => {
      wx.hideLoading();
      let res = resp.data;
      if (res.code == 1) {

        wx.navigateBack()
      } else {

        config.mytoast(res.msg, (res) => { });
      }
    }, (res) => {

    })
  },
  chooseImage() {
    let _this = this;

    let arr = _this.data.upload_list;

    if (arr.length >= 9) {

      config.mytoast('图片不能大于9张', (res) => { });
      return false;
    }

    wx.chooseImage({
      count: 1,
      // sizeType: 'original',
      sizeType: 'compressed',
      success: function (res) {
        let str = res.tempFilePaths[0];
        _this.setData({
          image_front: str
        })

        let suffix = str.substring(str.lastIndexOf('.'));

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log('data:image/png;base64,' + res.data)
            let arrList = _this.data.upload_list;

            arrList.push({
              src: str,
              singleCircleImg: res.data,
              singleCircleImgExt: suffix
            });

            _this.setData({
              upload_list: arrList,
            })
          }
        })

      },
    })
  },
  getLocation() {
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     const speed = res.speed
    //     const accuracy = res.accuracy
    //   }
    // })
    let _this = this;
    wx.getLocation({
      type: 'gcj02 ',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(res);
        _this.setData({
          latitude: latitude,
          longitude: longitude
        })

        _this.getAddress(latitude, longitude)


      }
    })
  },
  getAddress(latitude, longitude){
    let _this = this;
    var myAmapFun = new amapFile.AMapWX({ key: 'e99502730e85d295e4f08cabf7c50ce1' });

    myAmapFun.getRegeo({
      location: `${longitude},${latitude}`,
      success: function (e) {
        _this.setData({
          address_name: e[0].name
        })
      }
    })
  }
})