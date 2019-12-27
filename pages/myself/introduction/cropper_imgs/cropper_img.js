import WeCropper from '../../../../component/we-cropper/we-cropper.js'
const config = require('../../../../utils/config.js');
let app = getApp()


const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      rotateI: 0,//旋转默认角度
      tranlateX: width / 2,    
      tranlateY: height / 2,  /*定义canvas 的原点*/
      width, // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数,
      cut: {
        x: (width - 300) / 2,  /*裁剪框的坐标*/
        y: (height - 168) / 2, /*裁剪框的坐标*/
        width: 300,   //裁剪框的大小
        height: 168
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  //这个是保存上传裁剪后的图片的方法
  getCropperImage() {
    var that = this
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        uploadImage(avatar, function (res) { })
        function uploadImage(filePath, cb) {
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
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        // 获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    const { cropperOpt } = this.data
    if (option.src) {
      cropperOpt.src = option.src

      console.log(cropperOpt);

      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  },
  // 图片旋转
  rotateImg() {
    const self = this;
    let rotateI = this.data.rotateI + 1;
    this.setData({
      rotateI: rotateI
    })
    // 将旋转的角度传递给插件
    self.wecropper.updateCanvas(rotateI)
  }
})