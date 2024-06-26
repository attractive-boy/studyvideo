// pages/auth/course-auth/index.js
import {
  request
} from '../../../utils/api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: [],  // 用户列表
    allUsers: [],  // 全部用户列表用于选择器
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取id
    const id = options.id
    this.fetchCourse(id)
    this.fetchUsers(id)  // 获取用户列表
    this.fetchAllUsers(id)  // 获取所有用户用于选择器
    this.setData({ id })
  },

  fetchCourse(id) {
    // 获取课程信息
    request('/course/course/' + id, 'GET').then(res => {
      // 修改页面标题
      wx.setNavigationBarTitle({
        title: res.name
      })
    })
  },

  fetchUsers(id) {
    // 获取用户列表（示例）
    request(`/user/course/${id}/users`, 'GET').then(res => {
      this.setData({
        userList: res.data
      })
    })
  },

  fetchAllUsers(id) {
    // 获取全部用户用于选择器（示例）
    request(`/user/course/${id}/unauthorized_users`, 'GET').then(res => {
      this.setData({
        allUsers: res.data
      })
    })
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    const userList = this.data.userList.filter(user => user.id !== id);
    const course_id = this.data.id;
    // 调用后端接口
    request(`/user/course/${course_id}/users/${id}`, 'DELETE').then(res => {
      console.log(res);
      this.setData({ userList });
    })
  },

  handleSelectUser(e) {
    const index = e.detail.value;
    const selectedUser = this.data.allUsers[index];
    console.log('Selected user:', selectedUser);
    const userList = [...this.data.userList, selectedUser];
    const id = this.data.id;
    // 调用后端接口
    request(`/user/course/${id}/users/${selectedUser.id}`, 'POST').then(res => {
      console.log(res);
      this.setData({ userList: userList });
    })
  },

  handleAdd() {
    // 此处可以展示picker
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
