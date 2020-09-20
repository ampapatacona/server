const express = require('express')
const app = express()
const port = 3000
const MailConfig = require('./config/email');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const whitelist = ['https://ampatacona.com', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/contact', (req, res, next) => {
  console.log('req.body de contact', req.body.toString())
  const obj = req.body
  
  let transport = nodemailer.createTransport({
    host: process.env.SMTP_SERVICE_HOST,
    port: process.env.SMTP_SERVICE_PORT,
    auth: {
       user: process.env.SMTP_USER_NAME,
       pass: process.env.SMTP_USER_PASSWORD
    }
  });

  const message = {
    from: process.env.SMTP_USER_NAME, // Sender address
    to: process.env.SMTP_USER_NAME,  
    replyTo: obj.email,     // List of recipients
    subject: obj.subject,
    template: obj.message
  };
  return transport.sendMail(message, function(err, info) {
      if (err) {
        console.log('error al enviar correu de contacte', err)
      } else {
        console.log('correu de contacte enviat correctament', info);
      }
  });
  
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});
