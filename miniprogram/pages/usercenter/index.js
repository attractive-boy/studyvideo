import Toast from 'tdesign-miniprogram/toast/index';
import {
  request
} from '../../utils/api'
const menuData = [
  [
    {
      title: '课程授权',
      tit: '',
      url: '',
      type: 'auth',
    },
    {
      title: '课程上传',
      tit: '',
      url: '',
      type: 'upload',
    }
  ],
  [
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service',
    },
  ],
];

const getDefaultData = () => ({
  showMakePhone: false,
  userInfo: {
    avatarUrl: '',
    nickName: '正在登录...',
    phoneNumber: '',
  },
  menuData,
  customerServiceInfo: {
    serviceTimeDuration:"8：00 - 22：00",
    servicePhone:"10086"
  },
  currAuthStep: 1,
  showKefu: true,
  versionNo: '',
  defaultAvatarUrl:
      'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
  AuthStepType : '',
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.fetchUserInfo()
  },

  onShow() {

  },
  onPullDownRefresh() {
  },
  fetchUserInfo() {
    const that = this;
    const token = wx.getStorageSync('token');
    
    if (token) {
      request('/user/user', 'GET').then((result) => {
        if (result.success) {
          that.setData({ userInfo: result.data, currAuthStep:3});
        } else {
          console.log('获取用户信息失败：' + result.message);
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          });
        }
      }).catch((err) => {
        console.log('获取用户信息失败：', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      });
    }
  },
  checkAuth(){
    return this.data.userInfo.role == "admin"
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'auth': {
        if(this.checkAuth()){
          wx.navigateTo({ url: "/pages/auth/auth" });
        }else{
          Toast({
            context: this,
            selector: '#t-toast',
            message: '无权限',
            icon: '',
            duration: 1000,
          });
        }
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'upload':{
        if(this.checkAuth()){
          wx.navigateTo({ url: "/pages/upload/upload" });
        }else{
          Toast({
            context: this,
            selector: '#t-toast',
            message: '无权限',
            icon: '',
            duration: 1000,
          });
        }
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },
  handleUpdateUserInfo(event) {
    this.fetchUserInfo()
  },
  gotoUserEditPage(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }
});
