require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URL

mongoose.connect(url)

const desapSchema = mongoose.Schema({
  name: String,
  reward: String,
  contactNumber: String,
  description: String,
  missingDate: new Date(),
  lastSeenLocation: String,
  tipo: String,
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  imageLink: String,
  createdBy: String
})

desapSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Desaparecido', desapSchema)
