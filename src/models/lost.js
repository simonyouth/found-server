const mongoose = require('mongoose');
const moment = require('moment');
const { SchemaGenerator, Schema } = require('../middleware/schema');

let id = mongoose.Types.ObjectId;

const lost = {
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
  msgList: {
    type: Array,
    default: [],
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  isSolve: {
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

const LostSchema = SchemaGenerator(lost);
// LostSchema.virtual('time')
//   .get(() => moment(this.createTime).fromNow())

module.exports = LostSchema;
