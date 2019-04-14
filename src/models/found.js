const mongoose = require('mongoose');
const moment = require('moment');
const { SchemaGenerator, Schema } = require('../middleware/schema');

let id = mongoose.Types.ObjectId;

const found = {
  _id: {
    type: Schema.Types.ObjectId,
    default: id,
  },
  location: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: Number,
    required: true,
  },
  money: {
    type: Number,
  },
  imgList: {
    type: Array,
  },
  msgList: {
    type: Array,
    default: [],
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  createTime: {
    type: Date,
    default: moment()
  },
  updateTime: {
    type: Date,
    default: moment()
  }
};

const FoundSchema = SchemaGenerator(found);
// vr里的数据在本条数据创建时就确定了，不会随时间的变化而更改
// FoundSchema.virtual('time').get(() => {
//   return moment(this.createTime).fromNow()
// });

module.exports = FoundSchema;
