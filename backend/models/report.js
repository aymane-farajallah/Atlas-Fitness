const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({

  user_id: {
    type: String,
    required: true
  },

  coach_id: {
  type: String,
  required: true
  },

  message: {
  type: String
  },

  date: {
  type: Date
  },

},

{
     toJSON: {
      transform(doc,ret){
        delete ret._id;
        delete ret.__v;
        delete ret.updatedAt;
    }
  }
},{timestamps: true});

module.exports = report = mongoose.model('report', reportSchema);