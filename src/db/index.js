/*
连接mongodb数据库
 */
const mongoose = require('mongoose');
const { mongodUrl } = require('../../config');
const models = require('../models');

require("moment/locale/zh-cn");
const moment = require('moment');
moment.locale("zh-cn");

mongoose.Promise = require('bluebird'); // 让mongoose支持Promise

mongoose.connect(mongodUrl, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error('connection error: '));
db.once('open', () => {
  console.log('connection successfully: ', mongodUrl);
});

const User = mongoose.model('User', models.User, 'users');
const Found = mongoose.model('Found', models.Found, 'founds');

module.exports = {
  User,
  Found,
};
