const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coachSchema = new Schema({

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
    required: true
  },

  role: {
  type: String,
  default: 'coach'
  },

  gender: {
  type: String,
  required: true,
  enum: ['man','women']
  },
 
  city: {
  required: true,
  type: String
  },

  address: {
  required: true,
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

  bank_details: {
  type: String
  },

  phone_number: {
  type: Number
  },

  bio: {
  type: String
  },

  price: {
  type: Number  
  },

  cv: {
  type: String  
  },
  
  availability: {
  type: String,
  enum: ['online' , 'offline']
  }
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

module.exports = coach = mongoose.model('coach', coachSchema);