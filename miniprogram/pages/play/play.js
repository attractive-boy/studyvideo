// pages/play/play.js

import {
  request
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course:"",
    videoSrc:""
  },
  timer:null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.timer = setInterval(() => {
      wx.getScreenRecordingState({
        success: function (res) {
          if (res.state == "on") {
            wx.showModal({
              title: '提示',
              content: '此页面不允许录屏!',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/home/home'
                  })
                }
              }
            })
          }
        }
      })
    }, 2000)
    this.getCouser(options.id)
  },
  getCouser(id){
    const that = this
    request('/course/course/' + id, 'GET').then(res => {
      // 修改页面标题
      wx.setNavigationBarTitle({
        title: res.name
      })
      that.setData({
        course: res
      })
      that.getVideoSrc(res.oss_file_name)
    })
  },
  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  getVideoSrc(fileName) {
    const that = this
    request('/course/oss_file_url?file_key=' + fileName, 'GET').then(res => {
      that.setData({
        videoSrc: res.signed_url
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.stopScreenRecordingDetection()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.stopScreenRecordingDetection()
  },

  stopScreenRecordingDetection: function() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})