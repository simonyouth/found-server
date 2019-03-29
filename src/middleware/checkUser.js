/*
判断是否是第一次使用
User表是否存在该id
 */
const { User } = require('../db');

module.exports = {
  isNewUser: (id) => {
    return User.findOne({ id })
  }
};
