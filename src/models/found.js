const mongoose = require('mongoose');
const moment = require('moment');
const Schema = require('../middleware/schema');

let id = mongoose.Types.ObjectId;

const found = {
  _id: {
    type: Schema.Types.ObjectId,
    default: id,
  },
  createTime: {
    type: Date,
    default: moment().local()
  }
};

const FoundSchema = Schema(found);
FoundSchema.virtual('time').get(() => {
  return moment(this.createTime).fromNow()
});
