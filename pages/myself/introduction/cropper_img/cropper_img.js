const config = require('../../../../utils/config.js');
let app = getApp()

Page({
  data: {
    src: '',
    width: 300,//宽度
    height: 168,//高度,
    angle:0
  },
  onLoad: function (options) {
    //获取到image-cropper实例
    this.cropper = this.selectComponent("#image-cropper");
    //开始裁剪
    this.setData({
      src: options.src
    });
    wx.showLoading({
      title: '加载中'
    })
  },
  cropperload(e) {
    console.log("cropper初始化完成");
  },
  loadimage(e) {
    console.log("图片加载完成", e.detail);

    wx.hideLoading();
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },
  imgResets(e) {
    this.setData({
      angle: 0
    })
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //点击裁剪框阅览图片
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  uploadTap() {
    this.cropper.upload()
  },
  rotateImg(){
    let angle = this.data.angle;
    console.log(angle);

    // if (angle > 270){
    //   angle = 0;
    // }

    angle += 90

    this.cropper.setAngle(angle)

    this.setData({
      angle: angle
    })

  },
  //这个是保存上传裁剪后的图片的方法
  getCropperImage() {
    var that = this
    this.cropper.getImg((avatar) => {
      if (avatar) {
        uploadImage(avatar, function (res) { })
        function uploadImage(filePathJson, cb) {
          let filePath = filePathJson.url;
          console.log(filePath);
          let suffix = filePath.substring(filePath.lastIndexOf('.'));

          wx.getFileSystemManager().readFile({
            filePath: filePath, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              let json = {
                "image": res.data,
                "imageExt": suffix,

              }

              wx.showLoading({
                title: '数据加载中...',
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })


              config.ajax('POST', json, `/user/updateUserImage`, (resp) => {
                let res = resp.data;
                wx.hideLoading();
                cb(res);

                if (res.code == 1) {
                  wx.showToast({
                    title: '上传成功',
                  })
                  wx.redirectTo({
                    url: '/pages/myself/introduction/introduction',
                  })
                } else {
                  config.mytoast(res.msg, (res) => { })
                }
              }, (res) => {

              })

            }
          })
        }

      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
})