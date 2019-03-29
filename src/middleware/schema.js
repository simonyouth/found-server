/*
schema with timestamps
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
  SchemaGenerator: function (document) {
    return new Schema(document, {
      versionKey: false,
      // timestamps选项会在创建文档时自动生成createAt和updateAt两个字段，
      // 值都为系统当前时间。并且在更新文档时自动更新updateAt字段的值为系统当前时间
      timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime',
      }
    })
  },
  Schema,
};
