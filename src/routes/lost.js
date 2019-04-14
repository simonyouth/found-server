/*
失物招领
 */
const express = require('express');
const Promise = require('bluebird');
const moment = require('moment');
const router = express.Router();
const db = require('../db');
const { Schema } = require('../middleware/schema');
const ObjectId = Schema.Types.ObjectId;

const Lost = db.Lost;

// POST lost/publish
router.post('/publish', (req, res) => {
  const {
    title,
    location,
    content,
    category,
  } = req.body;
  const { id } = req.session.user;
  console.log(id)
  Lost.create({
    title,
    location,
    content,
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

// GET lost/list 寻物贴, 使用id自增进行分页查询
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
    isDelete: false,
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
  const countPromise = Lost.countDocuments();
  const listPromise = Lost.find(filter, {}, { lean: true })
    .sort({
      createTime: timeOrder,
    })
    .limit(size)
    .skip(Number(pageNum) * size)
    .populate('creator', 'avatarUrl nickName');

  Promise.all([countPromise, listPromise]).then((success) => {
    const [ total, doc ] = success;
    const result = doc.map(v => {
      const temp = {
        creator: v.creator,
        time: moment(v.createTime).fromNow(),
        timeDetail: moment(v.createTime).format('MM-DD HH:mm:ss'),
        type: 'lost',
      };
      delete v.createTime;
      delete v.updateTime;
      delete v.isDelete;
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
      msg: e,
    })
  })
});

// PUT /lost/post/manage 删除或标记为已解决
router.put('/post/manage', (req, res) => {
  const { type, id } = req.body;
  let promise;
  if (type === 'delete') {
    promise = Lost.findOneAndUpdate({ _id: id }, { isDelete: true })
  } else {
    promise = Lost.findOneAndUpdate({ _id: id }, { isSolve: true })
  }
  promise.then(doc => {
    res.send({
      httpCode: 200,
      success: true,
      msg: '操作成功'
    })
  }).catch(e => {
    res.send({
      httpCode: 200,
      success: false,
      msg: e.message,
    })
  })
});
// POST lost/post/add/msg 添加留言
router.post('/post/add/msg', (req, res) => {
  const {
    id,
    content,
  } = req.body;
  Lost.findById(id)
    .then(list => {
      const { msgList } = list;
      Lost.findOneAndUpdate({ _id: id }, {
        msgList: [...msgList, content],
      }, { new: true }).then(doc => {
        res.send({
          httpCode: 200,
          success: true,
          list: doc,
        })
      })
    })
    .catch(e => {
      res.send({
        httpCode: 200,
        success: false,
        msg: e.message,
      })
    })
});
module.exports = router;