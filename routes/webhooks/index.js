module.exports = function (app) {
  app.post('/webhook/change-claims', (req, res) => {
    const request = req.body
    console.log(request)
    return res.json({ data: request })
  })
}
