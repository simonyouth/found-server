const express = require('express');
const router = express.Router();
const db = require('../db');
const { code2Session } = require('../utils/request');
const WXEncodeData = require('../utils/WXEncodeData');
const { isNewUser } = require('../middleware/checkUser');

const User = db.User;

router.get('/', function(req, res, next) {
  res.render('index', {title: '2333'});
});

// GET users/login?code=[code]
router.get('/login', (req, res) => {
  const { code } = req.query;
  code2Session(code, (error, response, data) => {
    const { session_key, openid } = JSON.parse(data);
    // 存入session
    req.session.user = {
      openId: openid,
      sessionKey: session_key,
    };
    res.send({
      httpCode: 200,
      success: true,
    })
  });
});

// Post user/decodeUserInfo
router.post('/decodeUserInfo', (req, res) => {
  const { iv, encrytedData } = req.body;
  const { sessionKey, openId } = req.session.user;
  const wxEncode = new WXEncodeData(sessionKey);
  const info = wxEncode.decrypt(encrytedData, iv);
  const {
    nickName,
    gender,
    city,
    province,
    avatarUrl,
  } = info;
  isNewUser(openId).then(list => {
    if (!list) {
      // 新用户，插入User表
      User.create({
        _id: openId,
        avatarUrl,
        gender,
        nickName,
        city: `${province}-${city}`,
      }).then(() => {
        res.send({
          httpCode: 200,
          success: true,
          msg: 'register success',
        })
      })
    } else {
      res.send({
        httpCode: 200,
        success: true,
        msg: 'login success',
      })
    }
  });
});

module.exports = router;
