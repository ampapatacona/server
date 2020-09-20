const express = require('express')
const app = express()
const port = 3000
const MailConfig = require('./config/email');
const hbs = require('nodemailer-express-handlebars');
const smtpTransport = MailConfig.smtpTransport;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/contact', (req, res, next) => {

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
        console.log(err)
      } else {
        console.log(info);
      }
  });
  
});
