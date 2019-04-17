/*
私信
 */
const express = require('express');
const moment = require('moment');
const router = express.Router();
const db = require('../db');
const { Schema } = require('../middleware/schema');
const { sendMessage } = require('../middleware/ws');

const ObjectId = Schema.Types.ObjectId;
const Letter = db.Letter;

// POST letter/send?receiver=id&content=content&type='text'
router.post('/send', (req, res) => {
  const { receiver, content, type } = req.body;
  const { id } = req.session.user;
  Letter.create({
    receiver,
    content,
    type,
    creator: id,
  })
    .then(doc => {
      sendMessage(receiver);
      res.send({
        httpCode: 200,
        success: true,
        data: doc,
      })
    })
});

// GET /letter/all 获取与当前用户相关的私信
router.get('/all', (req, res) => {
  const { id } = req.session.user;
  const { receiver } = req.query;
  let promise;
  if (id) {
    // 查询发送者或接受者为当前用户
    promise = Letter.find({
      $or: [{ creator: id }, { receiver: id }],
    }, {}, { lean: true })
      .populate('creator receiver', '_id nickName avatarUrl');

    if (receiver) {
      // 获取指定用户的对话
      promise = Letter.find({
        $or: [
          { creator: receiver, receiver: id },
          { creator: id, receiver: receiver},
        ]
      }, {}, { lean: true }).populate('creator receiver', '_id nickName avatarUrl');
    }

    promise.then(doc => {
      const list = doc.map(v => ({
        createTime: moment(v.createTime).format('MM-DD HH:mm:ss'),
        content: v.type === 'text' ? v.content : v.content.split(','),
        type: v.type,
        receiver: v.receiver,
        creator: v.creator,
        id: v._id,
      }));
      res.send({
        httpCode: 200,
        success: true,
        list,
      })
    })
   //  Letter.aggregate([
   //    { $match: {
   //      $or: [
   //        { creator: mongoose.Types.ObjectId(id), creatorStatus: 1 },
   //        { receiver: mongoose.Types.ObjectId(id), receiverStatus: { $ne: 2 }},
   //      ]},
   //    },
   //    // { $group: {
   //    //     _id: "$_id",
   //    //     // "content": Letter.content,
   //    //     // "createTime": Letter.createTime,
   //    //     "creator": {$first: "$creator"},
   //    //     "receiver": {$first: "$receiver"},
   //    //   },
   //    // },
   //    { $sort: { createTime: -1 }}
   //    ]
   // ).then(doc => {
   //    res.send({
   //      httpCode: 200,
   //      success: true,
   //      list:doc,
   //    })
   //  })
  } else {
    res.send({
      httpCode: 401,
      success: false,
      msg: '未登录',
    })
  }
});

router.get('/unread', (req, res) => {
  const { id } = req.session.user;
  Letter.countDocuments({ receiver: id, receiverStatus: 1 })
    .then(total => {
      res.send({
        httpCode: 200,
        success: true,
        count: total,
      })
    }).catch(e => {

  })
});

module.exports = router;