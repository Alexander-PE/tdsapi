require('dotenv').config()	 // npm i dotenv
const express = require('express')	 // npm i express
const cors = require('cors')	 // npm i cors
const app = express()
const PORT = process.env.PORT

app.use(cors)
app.use(express.json())

app.get("/", (req, res) => {
  res.send(<h1>Hola Mundo</h1>)
})

app.post("/", (req, res) => {
  if (!req.body || req.body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port `)
})