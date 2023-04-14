require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URL

mongoose.connect(url)

const desaparecidoSchema = mongoose.Schema({
  name: String,
  reward: {
    type: String,
    required: false
  },
  contactNumber: String,
  description: String,
  missingDate: Date,
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
  pubId: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

desaparecidoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Desaparecido', desaparecidoSchema)
