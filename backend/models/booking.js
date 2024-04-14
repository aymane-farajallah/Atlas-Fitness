const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  coach_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  sessionType: {
    type: String,
    enum: ['online', 'in-person'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
  },
  session: {
    type: String 
  }
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
    }
  }
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
  // Get date components
  const year = this.date.getFullYear();
  const month = String(this.date.getMonth() + 1).padStart(2, '0');
  const day = String(this.date.getDate()).padStart(2, '0');
  const hours = String(this.date.getHours()).padStart(2, '0');
  const minutes = String(this.date.getMinutes()).padStart(2, '0');

  // Construct formatted date string
  this.date = `${year}/${month}/${day} // ${hours}/${minutes}`;

  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
