
const config = require('../../utils/config.js');
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc:'',
    upload_list: [],
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
  changeLength(e){
    if(e.detail.value.length > 120){
      config.mytoast('字符大于120，请精简!', (res) => { })
    }

    this.setData({
      desc: e.detail.value
    })

  },
  closeImg(e){
    let index = e.currentTarget.dataset.index;
    let arr = this.data.upload_list;

    arr.splice(index,1);
    this.setData({
      upload_list: arr
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
      count: 9,
      // sizeType: 'original',
      sizeType: 'compressed',
      success: function (res) {

        res.tempFilePaths.forEach((value,index)=>{


          // let value = res.tempFilePaths[0];

          let suffix = value.substring(value.lastIndexOf('.'));

          wx.getFileSystemManager().readFile({
            filePath: value, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              let arrList = _this.data.upload_list;

              arrList.push({
                src: value,
                singleCircleImg: res.data,
                singleCircleImgExt: suffix
              });

              _this.setData({
                upload_list: arrList,
              })
            }
          })


        })



      },
    })
  },
  addSelfIntroduce(e) {

    console.log(e.detail);
    if (!e.detail.value.remark){
      config.mytoast('描述信息不能为空', (res) => { })
      return false;
    }
    if (!e.detail.value.phone ){
      config.mytoast('联系方式不能为空', (res) => { })
      return false;
    }
    if (e.detail.value.phone.length != 11){
      config.mytoast('请输入正确的手机号', (res) => { })
      return false;
    }

    wx.showLoading({
      title: '数据提交中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    setTimeout(function(){
      
      config.mytoast('提交成功，正在跳转...', (res) => { })
      wx.navigateBack({})
    },1000)

    // config.ajax('POST', {
    //   remark: e.detail.value.remark
    // }, `/user/unsubscribe`, (res) => {
    //   wx.hideLoading();
    //   if (res.data.code == 1) {
        // config.mytoast('提交成功，正在跳转...', (res) => { })
        // wx.navigateBack({})
    //   } else {
    //     config.mytoast(res.data.msg, (res) => { })
    //   }
    // }, (res) => {

    // })
  },
})