const mongoose = require('mongoose');
const moment = require('moment');
const SchemaGenerator = require('../middleware/schema');
const Schema = mongoose.Schema;

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

const FoundSchema = SchemaGenerator(found);
FoundSchema.virtual('time').get(() => {
  return moment(this.createTime).fromNow()
});
