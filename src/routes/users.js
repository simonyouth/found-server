const express = require('express');
const router = express.Router();
const db = require('../db');
const { code2Session } = require('../middleware/request');
const { isNewUser } = require('../middleware/checkUser');

const User = db.User;

router.get('/', function(req, res, next) {
  res.render('index', {title: '2333'});
});

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
router.get('/login', (req, res) => {
  const { code } = req.query;
  code2Session(code, (error, response, data) => {
    const { session_key, openid } = JSON.parse(data);
    // 存入session
    req.session.openId = openid;
    req.session.user = {
      openId: openid,
      sessionKey: session_key,
    };
    isNewUser(openid).then(list => {
      if (!list) {
        // 新用户，插入User表
        User.create({
          _id: openid,
        }).then((d) => {
          res.send({
            httpCode: 200,
            success: true,
            msg: 'register success',
          })
        })
      }
    });
  });
});

module.exports = router;
