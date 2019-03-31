const request = require('request');
const { stringify } = require('qs');
const code2SessionAPI = 'https://api.weixin.qq.com/sns/jscode2session';
const appid = 'wx112e91358216def9';
const secret = 'ef779e8e8907f2e97c261f212fc2a889';
const grant_type = 'authorization_code';

function code2Session(code, cb) {
  const params = {
    appid,
    secret,
    grant_type,
    js_code: code,
  };
  request(`${code2SessionAPI}?${stringify(params)}`, cb)
}
module.exports = {
  code2Session,
};
