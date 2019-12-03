// pages/index/couple_face/couple_face.js
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
    let dom = {
      img:1,
      choose:false
    };
    let _this = this;
    let arr = _this.data.upload_list;

    if(arr.length <= 7){
      arr.push(dom);
      this.setData({
        upload_list: arr
      })
    }
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
    wx.navigateTo({
      url: '/pages/index/list/list',
    })
  }
})