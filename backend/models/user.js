const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  fullname: {
    type: String,
    required: true,
    max : 64
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    min: 8
  },

  role: {
  type: String,
  required: true,
  enum: ['user','admin'],
  default: 'user'
  },

  gender: {
    type: String,
    enum: ['man', 'women']
  },

  height: {
  type: Number
  },

  weight: {
  type: Number
  },
  
  city: {
  type: String
  },

  bank_details: {
  type: String
  },

  address: {
  type: String
  },

  image: {
  type: String
  },

  flag_system: {
  type: String,
  enum: ['banned' , 'not banned'],
  default: 'not banned'
  },
}, 
{
     toJSON: {
      transform(doc,ret){
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.updatedAt;
        delete ret.flag_system;
        delete ret.role; 
        delete ret.bank_details; 
    }
  }
},{timestamps: true});

module.exports = user = mongoose.model('user', userSchema);