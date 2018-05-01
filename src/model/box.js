import mongoose from 'mongoose';


const boxSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    minlength: 15,
  },
 
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model('box', boxSchema);

