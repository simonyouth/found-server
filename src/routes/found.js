/*
寻找失主
 */
const express = require('express');
const router = express.Router();
const { Found } = require('../db');
const { Schema } = require('../middleware/schema');
const ObjectId = Schema.Types.ObjectId;

// 失物贴, 使用id自增进行分页查询
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
