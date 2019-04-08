/*
私信
 */
const express = require('express');
const router = express.Router();
const { Letter } = require('../db');
const { Schema } = require('../middleware/schema');
const ObjectId = Schema.Types.ObjectId;

// POST letter/send?receiver=id&content=content&type='text'
router.post('/send', (req, res) => {
  const { receiver, content, type } = req.body;
  Letter.create({
    receiver,
    content,
    type,
  })
    .then(doc => {
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
  if (id) {
    // 查询发送者或接受者为当前用户
    Letter.find({
      $or: [{ creator: id }, { receiver: id }]
    })
      .populate('creator receiver', '_id nickName avatarUrl')
      .then(doc => {
        res.send({
          httpCode: 200,
          success: true,
          data: doc,
        })
      })
  } else {
    res.send({
      httpCode: 401,
      success: false,
      msg: '未登录',
    })
  }
});
