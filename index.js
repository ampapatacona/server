const express = require('express')
const app = express()
// const path = require('path')
const port = 3000
// const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const whitelist = ['https://ampatacona.com', 'http://localhost:3333']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/contact', (req, res, next) => {
  const obj = req.body

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_SERVICE_HOST,
    port: process.env.SMTP_SERVICE_PORT,
    auth: {
      user: process.env.SMTP_USER_NAME,
      pass: process.env.SMTP_USER_PASSWORD
    }
  })

  // const options = {
  //   extname: '.hbs',
  //   defaultLayout: 'main',
  //   partialsDir: path.join(__dirname, 'views/partials'),
  //   layoutsDir: path.join(__dirname, 'views/layouts')
  // }

  // transport.use('compile', hbs(options))

  const html = `
  <p>
  Nom: ${obj.name} <br>
  Email: ${obj.email} <br>
  Assumpte: ${obj.subject} <br>
  </p>

  <p>
  Missatge:
  </p>
  <p>
  ${obj.message}
  </p>
  `

  const message = {
    from: process.env.SMTP_USER_NAME, // Sender address
    to: process.env.SMTP_USER_NAME,
    replyTo: obj.email, // List of recipients
    subject: obj.subject,
    text: obj.message,
    html: html
    // template: 'contact',
    // context: {
    //   name: obj.name,
    //   email: obj.email,
    //   subject: obj.subject,
    //   message: obj.message
    // }
  }
  return transport.sendMail(message, function (err, info) {
    if (err) {
      console.log('error al enviar correu de contacte', err)
      return res.json({ error: err })
    } else {
      console.log('correu de contacte enviat correctament', info)
      return res.json({ success: info })
    }
  })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
