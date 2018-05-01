import mongoose from 'mongoose'; // import mongoose from module, lets us interact with mongo db as a middleware


// REVERSE
// let name  = 'judy';
// const judy = {
//   name: name,
// }
// you can do this instead
// let name  = 'judy';
// let age = 38;
// let hometown = 'renton';
// const judy = { 
// name,
// age,
// town } // {name: 'judy'}
// console.log(judy)

// DESTRUCTURING
// const vinicio = {
//   name:'vinicio'
//   age: ' nu'
//   hometown: 'el salvador'
//   const {name, age, hometown} = vinicio;
//   console.log(name, age, hometown)
// }

const boxSchema = mongoose.Schema({ // create model with properties
  firstName: {
    type: String,
    required: true,
    unique: true, // each time has to be different than the previous content of database
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

export default mongoose.model('box', boxSchema); // exporting module, default only exports one module

