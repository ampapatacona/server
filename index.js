const express = require('express')
const app = express()
// const path = require('path')
const port = 3000

const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const whitelist = ['https://ampatacona.com', 'https://server.ampatacona.com', 'https://app.ampatacona.com', 'http://localhost:3333', 'http://localhost:3000', 'http://localhost:8080']
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log(`${origin} Not allowed by CORS`)
      callback(new Error(`${origin} Not allowed by CORS`))
    }
  }
}
app.use(cors(corsOptions))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  next()
})

// Routes
require('./routes/test')(app)
require('./routes/email')(app)
require('./routes/firebase')(app)
require('./routes/webhooks')(app)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
