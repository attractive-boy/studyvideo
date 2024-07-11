// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

const app = getApp()

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  login(){
    // TODO: 登录
    // 将头像和名称存入本地存储
    wx.setStorageSync('userInfo', this.data.userInfo)
    this.gotoUserEditPage()
  },
  gotoUserEditPage() {
    const that = this
            // 发送 res.code, 用户信息到后台换取 token 和 userInfo
            const { request } = require('../../utils/api')
            wx.login({
              success: loginRes => {
                if (loginRes.code) {
                  request('/user/login', 'POST',
                    {
                      code: loginRes.code,
                      nickname: that.data.userInfo.nickName,
                      avatarUrl: that.data.userInfo.avatarUrl
                    },
                  ).then((result) => {
                      if (result.success) {
                        // 将 token 存储到本地
                        wx.setStorageSync('token', result.token);
                        wx.showToast({
                          title: '登录成功',
                          icon: 'success'
                        });
                        wx.switchTab({
                          url: '/pages/usercenter/index',
                        })
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
  }
})
