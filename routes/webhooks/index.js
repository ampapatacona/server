module.exports = function (app) {
  app.post('/webhook/change-claims', (req, res) => {
    const user = req.body.event.data.new
    const isAdmin = user.isadmin
    const updateClaimsModule = require('../firebase')
    updateClaimsModule.updateClaims(user.uid, isAdmin)
    console.log(`user ${user.email} admin state:`, isAdmin)
    return res.json({ data: { isAdmin: isAdmin } })
  })
}
