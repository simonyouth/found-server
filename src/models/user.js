/*
用户
 */
const moment = require('moment');
const Schema = require('../middleware/schema');
const users = {
  id: {
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

const UserSchema = Schema(users);

module.exports = UserSchema;
