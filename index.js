require('dotenv').config()// npm i dotenv
const express = require('express')// npm i express
const cors = require('cors')// npm i cors
const app = express()
const PORT = process.env.PORT

const Desaparecido = require('./mongo.js')

app.use(cors)
app.use(express.json())

app.get('/', async (req, res) => {
  const desap = await Desaparecido.find()
  res.json(desap)
})

app.get('/:id', async (req, res) => {
  const id = await Number(req.params.id)
  const desap = await Desaparecido.findById(id)
  if (!desap) {
    return res.status(404).json({ error: 'Persona, animal o cosa desaparecida no encontrada' })
  }
  res.json(desap)
})

app.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  Desaparecido.deleteOne({ id }).then(desap => {
    res.json(desap)
  })
})

app.post('/', async (req, res) => {
  if (!req.body || req.body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }
  const desap = new Desaparecido(req.body)
  await desap.save()
  res.status(201).json(desap)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
