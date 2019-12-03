// pages/home/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    index: -1,
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    sign_zodiac: {
      index:0,
      array: ['不限','鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  bindSignZodiac(e){

    this.setData({
      "sign_zodiac.index": e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
    
  },
  clearResult: function (e) {
    console.log('select clearResult', e.detail)
    this.setData({
      inputVal:''
    })
  },
  inputChange(e){

    console.log('inputChange', e.detail)
    this.setData({
      inputVal: e.detail.value
    })
  }
})