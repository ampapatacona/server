module.exports = function (app) {
  app.post('/webhook/change-claims', (req, res) => {
    const isAdmin = req.body.event.data.new.isadmin
    console.log(isAdmin)
    return res.json({ data: { isAdmin: isAdmin } })
  })
}
