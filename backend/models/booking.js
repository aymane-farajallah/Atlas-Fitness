const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

  user_id: {
    type: String,
    required: true,
    unique: true
  },

  date: {
  type: Date
  },

  price: {
  type: Number
  },

},

{
     toJSON: {
      transform(doc,ret){
        delete ret._id;
        delete ret.date;
        delete ret.__v;
        delete ret.updatedAt;
    }
  }
},{timestamps: true});

module.exports = booking = mongoose.model('booking', bookingSchema);