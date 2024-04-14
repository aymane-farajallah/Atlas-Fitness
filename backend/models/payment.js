const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({

  user_id: {
    type: String,
    required: true,
    unique: true
  },

  amount: {
  type: Number
  },

  payment_method: {
  type: String
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

module.exports = payment = mongoose.model('payment', paymentSchema);