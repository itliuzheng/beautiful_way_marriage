// pages/single/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    upload_list: []
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
    }else{
      //草稿
    }
  },
  add_upload() {
    let dom = {
      img: 1,
      choose: false
    };
    let _this = this;
    let arr = _this.data.upload_list;

    if (arr.length <= 7) {
      arr.push(dom);
      this.setData({
        upload_list: arr
      })
    }
  },
})