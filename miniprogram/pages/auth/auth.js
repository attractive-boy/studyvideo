// pages/auth/auth.js
import {
  request
} from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: [],
    level: 0,
    showlist: [],
    education_level:'',
    clickName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getCourses()
  },
  getCourses() {
    const that = this
    request('/course/authorized_courses', 'GET').then(res => {
      console.log(res)
      this.setData({
        courses: res
      })
      that.filterData()
    })
  },
  filterData() {
    console.log("call for filterData===>", this.data.level)
    const that = this
    var showlist = []
    switch (this.data.level) {
      case 0:
        var set = new Set();
        this.data.courses.forEach(item => {
          set.add(item.education_level);
        });
        // 将 Set 转换为数组并映射成对象数组
        showlist = Array.from(set).map(value => ({
          name: value
        }));
        break;
      case 1:
        var set = new Set();
        this.data.courses.forEach(item => {
          if(item.education_level == that.data.clickName){
            set.add(item.subject);
          }
        });
        // 将 Set 转换为数组并映射成对象数组
        showlist = Array.from(set).map(value => ({
          name: value
        }));
        this.setData({
          education_level:that.data.clickName
        })
        break;
      case 2:
        showlist = that.data.courses.filter(course => 
          course.education_level === that.data.education_level && 
          course.subject === that.data.clickName
      );
        break;
      default:
        break
    }
    this.setData({
      showlist: showlist
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  navToAuth(event) {
    console.log("event=====>", event)
    if(event.detail.id){
      wx.navigateTo({
        url: "/pages/auth/course-auth/index" + '?id=' + event.detail.id
      })
    }else{
      this.setData({
        level: this.data.level + 1,
        clickName:event.detail.name
      });
      this.filterData()
    }
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