import {
  fetchGoodsList
} from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';
import {
  request
} from '../../utils/api'
Page({
  data: {
    imgSrcs: [],
    education_levels: [],
    subjects: [],
    goodsList: [],
    goodsListLoadStatus: 0,
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

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {

    }
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
    const {
      genSwiperImageList
    } = require('../../model/swiper');
    this.setData({
      imgSrcs: genSwiperImageList()
    })
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
  },
  getSubjects(educationLevel) {
    request(`/course/subjects?education_level=${educationLevel}`, 'GET').then((res) => {
      this.setData({
        subjects: res,
        pageLoading: false,
      });
    })
  },

  onReTry() {

  },

  goodListClickHandle(e) {
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

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车',
    });
  },

  navToSearchPage() {
    wx.navigateTo({
      url: '/pages/goods/search/index'
    });
  },

  navToActivityDetail({
    detail
  }) {
    const {
      index: promotionID = 0
    } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },
});