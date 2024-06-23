import {
  baseUrl
} from '../config/index';
const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
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