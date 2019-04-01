/*
用户
 */
const moment = require('moment');
const mongoose = require('mongoose');
const { SchemaGenerator, Schema } = require('../middleware/schema');
let id = mongoose.Types.ObjectId;

const users = {
  _id: {
    type: Schema.Types.ObjectId,
    default: id,
  },
  openId: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  gender: {
    type: Number,
  },
  nickName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  createTime: {
    type: Date,
    default: moment().local()
  },
  updateTime: {
    type: Date,
    default: moment().local()
  }
};

const UserSchema = SchemaGenerator(users);

module.exports = UserSchema;
