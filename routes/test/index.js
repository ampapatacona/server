module.exports = function (app) {
  app.get('/hello', (req, res) => {
    res.json({ data: 'hello world' })
  })
  app.post('/test', (req, res) => {
    console.log(req.body)
    res.json({ data: req.body })
  })
}
