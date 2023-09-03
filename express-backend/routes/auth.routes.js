const auth = require('../controllers/auth.controller')

let router = require('express').Router()

router.post('/register', auth.register)
router.post('/login', auth.login)

module.exports = router