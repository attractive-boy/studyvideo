// pages/auth/auth.js
import {
  request
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getCourses()
  },
  getCourses(){
    request('/course/authorized_courses','GET').then(res=>{
      this.setData({
        courses: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  navToAuth(event){
    console.log("event-id=====>",event.detail.id)
    wx.navigateTo({
      url: "/pages/auth/course-auth/index" + '?id=' + event.detail.id
    })
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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