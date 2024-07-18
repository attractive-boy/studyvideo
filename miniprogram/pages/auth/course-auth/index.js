// pages/auth/course-auth/index.js
import {
  request
} from '../../../utils/api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: [], // 用户列表
    allUsers: [], // 全部用户列表用于选择器
    id: '',
    visible: false,
    selectUser:'',
    searchQuery:'',
    selectUsers:[],
    filteredUsers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取id
    const id = options.id
    this.fetchCourse(id)
    this.fetchUsers(id) // 获取用户列表
    this.fetchAllUsers(id) // 获取所有用户用于选择器
    this.setData({
      id
    })
  },
  onColumnChange(e) {
    console.log('picker pick:', e);
  },

  onPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;

    console.log('picker change:', e.detail);
    this.handleSelectUser(value[0])
    this.setData({
      visible: false,
      selectUser: value
    });
  },

  onPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      visible: false,
    });
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
      const userList = res.data.map((user, index) => ({
        label: user.nickname,
        value: index,
      }));
      console.log(userList);
      this.setData({
        allUsers: res.data,
        filteredUsers: userList,
        selectUsers: userList
      });
    })
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    const userList = this.data.userList.filter(user => user.id !== id);
    const course_id = this.data.id;
    // 调用后端接口
    request(`/user/course/${course_id}/users/${id}`, 'DELETE').then(res => {
      console.log(res);
      this.setData({
        userList
      });
    })
  },

  handleSelectUser(index) {
    const selectedUser = this.data.allUsers[index];
    console.log('Selected user:', selectedUser);
    const userList = [...this.data.userList, selectedUser];
    const id = this.data.id;
    // 调用后端接口
    request(`/user/course/${id}/users/${selectedUser.id}`, 'POST').then(res => {
      console.log(res);
      this.setData({
        userList: userList
      });
    })
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },
  onPicker() {
    this.setData({ visible: true });
  },
  handleAdd() {
    // 此处可以展示picker
  },

  onSearchInput(e) {
    const query = e.detail.value.toLowerCase();
    const filteredUsers = this.data.selectUsers.filter(user => user.label.toLowerCase().includes(query));
    this.setData({
      searchQuery: query,
      filteredUsers: filteredUsers,
    });
  },
  // 新增删除课程的方法
  handleDeleteCourse() {
    const course_id = this.data.id;
    wx.showModal({
      title: '删除课程',
      content: '确定要删除此课程吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用后端接口删除课程
          request(`/course/course/${course_id}`, 'DELETE').then(res => {
            console.log(res);
            // 删除成功后，可以进行页面跳转或提示
            wx.showToast({
              title: '课程已删除',
              icon: 'success',
            });
            wx.navigateBack(); // 返回上一页
          }).catch(err => {
            console.error(err);
            wx.showToast({
              title: '删除失败',
              icon: 'none',
            });
          });
        }
      }
    });
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