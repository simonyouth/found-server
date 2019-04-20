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
    createTime: moment().local()
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
  const id = req.session && req.session.user && req.session.user.id;
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
    filter.category = Number(category);
  }
  const listPromise = Found.find(filter, {}, { lean: true })
    .sort({
      createTime: timeOrder,
    })
    .limit(size)
    .skip(Number(pageNum) * size)
    .populate('creator', 'avatarUrl nickName');
  const countPromise = Found.countDocuments();
  Promise.all([countPromise, listPromise]).then(success => {
    const [ total, doc ] = success;
    const result = doc.map(v => {
      const temp = {
        creator: v.creator,
        updateAt: moment(v.updateTime).fromNow(),
        createAt: moment(v.createTime).format('MM-DD HH:mm:ss'),
        type: 'found',
        isStar: v.starList.indexOf(id) > -1,
      };
      delete v.createTime;
      delete v.updateTime;
      delete v.isDelete;
      delete v.starList;
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
      msg: e.message
    })
  })
});
router.put('/post/manage', (req, res) => {
  const { type, id } = req.body;
  let promise;
  if (type === 'delete') {
    promise = Found.findOneAndUpdate({ _id: id }, { isDelete: true, updateTime: moment().local() })
  } else {
    promise = Found.findOneAndUpdate({ _id: id }, { isSolve: true, updateTime: moment().local() })
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
router.post('/post/add/msg', (req, res) => {
  const {
    id,
    content,
  } = req.body;
  Found.findById(id)
    .then(list => {
      const { msgList } = list;
      Found.findOneAndUpdate({ _id: id }, {
        msgList: [...msgList, content],
        updateTime: moment().local(),
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

// POST found/post/star?postId={postId} 收藏
router.post('/post/star', (req, res) => {
  const { id } = req.session.user;
  const { postId } = req.body;
  Found.findOneAndUpdate({ _id: postId}, {
    $push: { starList: id }
  }).then(doc => {
    res.send({
      success: true,
      msg: '收藏成功',
    })
  }).catch(e => {
    res.send({
      success: false,
      msg: e.message,
    })
  })
});
module.exports = router;