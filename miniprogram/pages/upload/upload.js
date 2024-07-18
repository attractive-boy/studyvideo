Page({
  data: {
    courseName: '',
    educationLevel: '',
    subject: '',
    fileName: '',
    filePath: ''
  },

  handleInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  chooseFile() {
    const that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'video',
      success: (res) => {
        console.log(res)
        const file = res.tempFiles[0];
        that.setData({
          fileName: file.name,
          filePath: file.path
        });
        
      },
      fail: (err) => {
        console.error('文件选择失败', err);
      }
    });
  },

  uploadCourse() {
    const { courseName, educationLevel, subject, filePath } = this.data;

    if (!courseName || !educationLevel || !subject || !filePath) {
      wx.showToast({
        title: '请完整填写信息并选择文件',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '上传中...',
      mask: true
    });

    const { baseUrl } = require('../../config/index');
    wx.uploadFile({
      url: `${baseUrl}/course/upload_to_oss`,
      filePath: filePath,
      name: 'file',
      timeout:9000000,
      formData: {
        name: courseName,
        education_level: educationLevel,
        subject: subject
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });
        console.error('文件上传失败', err);
      }
    });
  }
});
