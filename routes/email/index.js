const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')

module.exports = function (app) {
  // contact form
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

    const options = {
      viewEngine: {
        extname: '.hbs', // handlebars extension
        layoutsDir: 'views/email/', // location of handlebars templates
        defaultLayout: 'contact', // name of main template
        partialsDir: 'views/email/' // location of your subtemplates aka. header, footer etc
      },
      viewPath: 'views/email',
      extName: '.hbs'
    }

    transport.use('compile', hbs(options))

    const message = {
      from: process.env.SMTP_USER_NAME, // Sender address
      to: process.env.SMTP_USER_NAME,
      replyTo: obj.email, // List of recipients
      subject: obj.subject,
      // text: obj.message,
      // html: html
      template: 'contact',
      context: {
        name: obj.name,
        email: obj.email,
        subject: obj.subject,
        message: obj.message
      }
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
}
