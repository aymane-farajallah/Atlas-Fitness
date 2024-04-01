const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workout_trackingSchema = new Schema({

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

  program: {
  type: String,
  required: true
  },

  workout_day: {
  type: String,
  required: true
  },

  reps: {
  type: Number,
  required: true
  },

  sets: {
  type: Number,
  required: true
  },

  load: {
  type: Number
  },

  exercice: {
  type: String,
  required: true,
  },
    
  exercice_group: {
  type: String,
  required: true,
  },

  workout: {
  type: String,
  required: true,
  },

  note: {
  type: String
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

module.exports = workout_tracking = mongoose.model('Workout', workout_trackingSchema);