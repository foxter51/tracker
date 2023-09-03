const { authenticateToken } = require('../config/jwt.config')
const messages = require('../controllers/messages.controller')

let router = require('express').Router()

router.get('/messages', authenticateToken, messages.getMessages)

module.exports = router