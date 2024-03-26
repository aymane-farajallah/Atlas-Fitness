const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const session_typeSchema = new Schema({

  user_id: {
    type: String,
    required: true,
    unique: true
  },

  coach_id: {
  type: String,
  required: true,
  unique: true
  },

  session_type: {
  type: String,
  enum: [ 'online', 'real-life']
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

module.exports = session_type = mongoose.model('session_type', session_typeSchema);