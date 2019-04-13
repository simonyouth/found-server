/*
寻物启事
 */
const express = require('express');
const Promise = require('bluebird');
const moment = require('moment');
const router = express.Router();
const db = require('../db');
const { Schema } = require('../middleware/schema');
const ObjectId = Schema.Types.ObjectId;
const Found = db.Found;

// POST found/publish
router.post('/publish', (req, res) => {
  const {
    title,
    location,
    content,
    money = null,
    category,
    imgList = [],
  } = req.body;
  const { id } = req.session.user;
  console.log(id)
  Found.create({
    title,
    location,
    content,
    imgList,
    money: Number(money),
    category: Number(category),
    creator: id,
  }).then(doc => {
    res.send({
      httpCode: 200,
      success: true,
      msg: '发布成功',
    })
  })
    .catch(e => {
    res.send({
      httCode: 502,
      success: false,
      msg: e.message,
    })
  })
});

// 寻物贴, 使用id自增进行分页查询
router.get('/list', (req, res) => {
  const {
    size = 8,
    pageNum = 0,
    location,
    keyWords,
    timeOrder = -1,
    category,
  } = req.query;
  const filter = {
    location: {
      $regex: new RegExp(location, 'i'),
    },
    $or: [
      { title: { $regex: new RegExp(keyWords, 'i') }},
      { content: { $regex: new RegExp(keyWords, 'i') }}
    ],
  };
  // if (lastId) {
  //   filter['_id'] = {
  //     $lt: ObjectId(lastId)
  //   }
  // };
  if (category) {
    filter.category = {
      category,
    }
  }
  const listPromise = Found.find(filter, {}, { lean: true })
    .sort({
      createTime: timeOrder,
    })
    .limit(size)
    .skip(pageNum)
    .populate('creator', 'avatarUrl nickName');
  const countPromise = Found.countDocuments();
  Promise.all([countPromise, listPromise]).then(success => {
    const [ total, doc ] = success;
    const result = doc.map(v => {
      const temp = {
        creator: v.creator,
        time: moment(v.createTime).fromNow(),
        timeDetail: moment(v.createTime).format('MM-DD HH:mm:ss')
      };
      delete v.createTime;
      delete v.updateTime;
      return { ...temp, ...v };
    });
    res.send({
      httpCode: 200,
      success: true,
      list: result,
      total,
    })
  }).catch(e => {
    res.send({
      httpCode: 200,
      success: false,
      msg: '查询失败'
    })
  })
});

module.exports = router;