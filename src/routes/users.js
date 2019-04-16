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
    User.findOne({openId: openid}).then(doc => {
      res.send({
        httpCode: 200,
        success: true,
        id: doc._id,
      })
    })
  });
});

// Post user/decodeUserInfo
router.post('/decodeUserInfo', (req, res) => {
  const { iv, encryptedData } = req.body;
  const { sessionKey, openId } = req.session.user;
  const wxEncode = new WXEncodeData(sessionKey);
  const info = wxEncode.decrypt(encryptedData, iv);
  const {
    nickName,
    gender,
    city,
    province,
    avatarUrl,
  } = info;
  isNewUser(openId).then(list => {
    let getId;
    if (!list) {
      // 新用户，插入User表
      getId = User.create({
        openId: openId,
        avatarUrl,
        gender,
        nickName,
        city: `${province}-${city}`,
      });
    } else {
      getId = User.findOne({ openId })
    }
    getId.then(({ _id }) => {
      // 使用自动生成的_id作为标识而不是openId
      req.session.user.id = _id;
      res.send({
        httpCode: 200,
        success: true,
        id: _id,
      })
    })
  });
});

// GET users/info
router.get('/info', (req, res) => {
  const { id } = req.query;
});
module.exports = router;
