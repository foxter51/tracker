const { authenticateToken } = require('../config/jwt.config')
const teamController = require('../controllers/team.controller')

let router = require('express').Router()

router.post('/teams', authenticateToken, teamController.create)
router.get('/teams', authenticateToken, teamController.findAll)

module.exports = router