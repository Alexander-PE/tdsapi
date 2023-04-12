require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()
const cloudinary = require('cloudinary').v2
const PORT = process.env.PORT

cloudinary.config({
  cloud_name: 'djeswamlh',
  api_key: '212916675997174',
  api_secret: 'ZfLrVaa-tJalUXpnisCMyYJmRVM'
})

const Desaparecido = require('./Desaparecido.js')
const User = require('./User.js')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Desaparecidos API</h1>')
})

app.post('/register', async (req, res) => {
  if (!req.body || req.body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  const { name, email, password } = req.body

  // Validar que se hayan proporcionado una dirección de correo electrónico y una contraseña
  if (!email || !password) {
    return res.status(400).send('Proporciona una dirección de correo electrónico y una contraseña')
  }

  try {
    // Verificar si ya existe un usuario con la dirección de correo electrónico proporcionada
    const existingUser = await User.find({ email })
    if (existingUser.length > 1) {
      return res.status(400).send('Ya existe una cuenta con la dirección de correo electrónico proporcionada')
    }

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear un nuevo usuario y guardarlo en la base de datos
    const user = new User({ name, email, password: hashedPassword })
    await user.save()

    res.status(201).send('Usuario creado exitosamente')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear el usuario')
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Validar que se hayan proporcionado una dirección de correo electrónico y una contraseña
  if (!email || !password) {
    return res.status(400).send('Proporciona una dirección de correo electrónico y una contraseña')
  }

  try {
    // Verificar si existe un usuario con la dirección de correo electrónico proporcionada
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).send('No existe un usuario con este correo')
    }

    // Verificar que la contraseña proporcionada coincida con la contraseña almacenada en la base de datos
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) {
      return res.status(401).send('Credenciales inválidas')
    }

    // Crear un token JWT que contenga el ID del usuario
    const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET)
    res.json({ uid: user.id, token })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al iniciar sesión')
  }
})

app.get('/desaparecidos', (req, res) => {
  Desaparecido.find({}).then(desap => res.json(desap))
})

app.get('/desaparecidos/:id', (req, res) => {
  const id = req.params.id
  Desaparecido.findById(id).then(desap => res.json(desap))
})

app.delete('/desaparecidos/:id', (req, res) => {
  const id = req.params.id
  Desaparecido.findByIdAndDelete(id).then(desap => {
    console.log(desap)
    cloudinary.uploader.destroy(desap.pubId)
    res.status(200).json(desap)
  })
})

app.put('/desaparecidos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const values = req.body
    const item = await Desaparecido.findByIdAndUpdate(id, values).then(desap => res.json(desap))
    if (!item) {
      return res.status(404).json({ error: 'item not found' })
    }
  } catch (err) {
    console.log(err)
  }
})

app.post('/desaparecidos', (req, res) => {
  if (!req.body || req.body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }
  const desap = new Desaparecido(req.body)
  desap.save()
  res.status(201).json(desap)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
