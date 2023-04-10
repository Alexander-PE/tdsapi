require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URL

mongoose.connect(url)

const usersSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
})

usersSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('User', usersSchema)
