/*
私信
 */
const moment = require('moment');
const mongoose = require('mongoose');
const { SchemaGenerator, Schema } = require('../middleware/schema');
const id = mongoose.Types.ObjectId;

/**
 * creatorStatus 发送消息的状态 1：已发送 2：发送失败 3：已删除
 * receiverStatus 接收消息状态 1：未读 2：已读 3：已删除
 * type 消息类型 'text' 'image'
 * content 消息体 文字内容或者url
 **/
const letter = {
  _id: {
    type: Schema.Types.ObjectId,
    default: id,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creatorStatus: {
    type: Number,
    default: 1,
  },
  receiverStatus: {
    type: Number,
    default: 1,
  },
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createTime: {
    type: Date,
    default: moment(),
  },
  updateTime: {
    type: Date,
    default: moment(),
  }
};

module.exports = SchemaGenerator(letter);
