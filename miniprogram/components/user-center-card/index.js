const AuthStepType = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
};
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    currAuthStep: {
      type: Number,
      value: AuthStepType.ONE,
    },
    userInfo: {
      type: Object,
      value: {},
    }
  },
  data: {
    defaultAvatarUrl:
      'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    AuthStepType,
  },
  lifetimes: {
    attached() {
    },
  },
  methods: {
    gotoUserEditPage() {
      const that = this
      wx.getUserProfile({
        desc: '获取用户信息', // 声明获取用户信息的用途
        success: profileRes => {
          const userInfo = profileRes.userInfo;
          console.log(userInfo)
          
          // 发送 res.code, 用户信息到后台换取 token 和 userInfo
          const { request } = require('../../utils/api')
          wx.login({
            success: loginRes => {
              if (loginRes.code) {
                request('/user/login', 'POST',
                  {
                    code: loginRes.code,
                    nickname: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl
                  },
                ).then((result) => {
                    if (result.success) {
                      // 将 token 存储到本地
                      wx.setStorageSync('token', result.token);
                      that.setData({ userInfo,currAuthStep:AuthStepType.THREE });
                      that.triggerEvent('updateUserInfo', {  });
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success'
                      });
                    } else {
                      console.log('登录失败：' + result.data.message);
                      wx.showToast({
                        title: '登录失败',
                        icon: 'none'
                      });
                    }
                });
              }
            }
          })
        },
        fail: err => {
          console.log('获取用户信息失败：', err);
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          });
        }
      });
    }
  },
});
