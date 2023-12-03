const auth = require('../controllers/auth.controller')

let router = require('express').Router()

router.post('/register', auth.register)
router.post('/login', auth.login)
router.post('/login/google', auth.doRequestGoogleUrl)
router.post('/login/google/approve', auth.approveGoogleLogin)

module.exports = router