const express = require('express');
const moment = require('moment');
const router = express.Router();
const db = require('../db');
const { code2Session } = require('../utils/request');
const WXEncodeData = require('../utils/WXEncodeData');
const { isNewUser } = require('../middleware/checkUser');

const User = db.User;
const Lost = db.Lost;
const Found = db.Found;

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
      if (doc) {
        req.session.user.id = doc._id;
      }
      res.send({
        httpCode: 200,
        success: true,
        userinfo: doc,
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

router.get('/post/:type', (req, res) => {
  const { id } = req.session.user;
  const { type } = req.params;

  let filter = [];
  let promiseArr = [];
  if (type === 'publish') {
    filter = [
      { creator: id },
      { isDelete: false },
      { lean: true }
    ];
    promiseArr = [
      Lost.find(...filter).populate('creator', 'avatarUrl nickName'),
      Found.find(...filter).populate('creator', 'avatarUrl nickName')
    ];
  } else if (type === 'star') {
    // starList中是否存在当前id
    promiseArr = [
      Lost.where("starList").in([id]).populate('creator', 'avatarUrl nickName').lean(),
      Found.where('starList').in([id]).populate('creator', 'avatarUrl nickName').lean()
    ]
  }

  Promise.all(promiseArr)
    .then(docs => {
      let [ lost, found ] = docs;
      lost = lost.map(v => {
        const temp = {
          creator: v.creator,
          updateAt: moment(v.updateTime).fromNow(),
          createAt: moment(v.createTime).format('MM-DD HH:mm:ss'),
          type: 'lost',
          isStar: v.starList && v.starList.indexOf(id) > -1,
        };
        delete v.createTime;
        delete v.updateTime;
        delete v.isDelete;
        delete v.starList;
        return { ...temp, ...v };
      });
      found = found.map( v => {
        const temp = {
          creator: v.creator,
          updateAt: moment(v.updateTime).fromNow(),
          createAt: moment(v.createTime).format('MM-DD HH:mm:ss'),
          type: 'found',
          isStar: v.starList && v.starList.indexOf(id) > -1,
        };
        delete v.createTime;
        delete v.updateTime;
        delete v.isDelete;
        delete v.starList;
        return { ...temp, ...v };
      });
      res.send({
        success: true,
        list: [...lost,...found]
      })
    })
    .catch(e => {
      res.send({
        success: false,
        msg: e.message,
      })
    })
});
module.exports = router;
