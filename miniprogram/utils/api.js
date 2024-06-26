import {
  baseUrl
} from '../config/index';
const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    const header = { 'Content-Type': 'application/json' }
    const token = wx.getStorageSync('token');
    if (token) {
      header.Authorization = token;
    }
    wx.request({
      url: `${baseUrl}${url}`,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

module.exports = {
  request
};