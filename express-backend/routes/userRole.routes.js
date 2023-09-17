const  { authenticateToken } = require('../config/jwt.config')
const userRoleController = require('../controllers/userRole.controller')

let router = require('express').Router()

router.post('/teams/userRoles', authenticateToken, userRoleController.create)

module.exports = router