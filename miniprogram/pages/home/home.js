
import {
  request
} from '../../utils/api'
Page({
  data: {
    imgSrcs: [
      'https://wechatapppro-1252524126.cdn.xiaoeknow.com/appkai4s6cg4946/image/b_u_cjs1fj4q7pujmmpa3450/b9dtw8lng5yiy4.png?imageMogr2/thumbnail/750x/quality/80|imageMogr2/ignore-error/1',
      'https://wechatapppro-1252524126.cdn.xiaoeknow.com/appkai4s6cg4946/image/b_u_cjs1fj4q7pujmmpa3450/eknrablng5yixt.png?imageMogr2/thumbnail/750x/quality/80|imageMogr2/ignore-error/1',
      'https://wechatapppro-1252524126.cdn.xiaoeknow.com/appkai4s6cg4946/image/b_u_cjs1fj4q7pujmmpa3450/1wq0i4lng5yixv.png?imageMogr2/thumbnail/750x/quality/80|imageMogr2/ignore-error/1',
      'https://wechatapppro-1252524126.cdn.xiaoeknow.com/appkai4s6cg4946/image/b_u_cjs1fj4q7pujmmpa3450/20zjs8lng5yixq.png?imageMogr2/thumbnail/750x/quality/80|imageMogr2/ignore-error/1',
      'https://wechatapppro-1252524126.cdn.xiaoeknow.com/appkai4s6cg4946/image/b_u_6241671c84895_ZcZyaYWn/lc8pcigj03vv.png?imageMogr2/thumbnail/750x/quality/80|imageMogr2/ignore-error/1',
    ],
    education_levels: [],
    active_level:'初中',
    subjects: [],
    courses: [],
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: {
      type: 'dots'
    },
    swiperImageProps: {
      mode: 'scaleToFill'
    },
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },


  onLoad() {
    this.init();
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    const that = this;
    request('/course/education_levels', 'GET').then((res) => {
      that.setData({
        education_levels: res,
      });
      that.getSubjects('初中');
    })
  },

  tabChangeHandle(e) {
    console.log("e===>", e)
    this.getSubjects(e.detail.value);
    this.setData({
      active_level: e.detail.value
    })
  },
  getSubjects(educationLevel) {
    const that = this;
    request(`/course/subjects?education_level=${educationLevel}`, 'GET').then((res) => {
      this.setData({
        subjects: res,
        pageLoading: false,
      });
      that.getCourses('语文')
    })
  },

  ListClickHandle(e) {
    const {
      index
    } = e.detail;
    const {
      spuId
    } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  navToSearchPage() {
  },

  subjectChangeHandle(e){
    const subject = e.detail.value
    this.getCourses(subject)
  },
  getCourses(subject) {
    const level = this.data.active_level
    const url = `/course/courses?subject=${subject}&education_level=${level}`
    const that = this
      request(url, 'GET').then((res) => {
        that.setData({
          courses: res,
        })
      })
  },
});