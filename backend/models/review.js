const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({

  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
},
userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
},
rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
},
comment: {
    type: String,
    required: true
}
    
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

module.exports = report = mongoose.model('review', reviewSchema);