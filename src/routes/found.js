/*
寻物启事
 */
const express = require('express');
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
  const { size = 8, latsId } = req.query;
  const listPromise = Found.find({
    _id: {
      $lt: ObjectId(latsId)
    }
  }, {}, {
    lean: true
  }).sort({
    creatTime: -1
  }).limit(size)
    .populate('creator');

  listPromise.then(doc => {
    res.send({
      httpCode: 200,
      success: true,
      list: doc,
    })
  })
});

module.exports = router;