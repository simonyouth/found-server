/*
用户
 */
const moment = require('moment');
const { SchemaGenerator } = require('../middleware/schema');
const users = {
  _id: {
    type: String,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: true,
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
