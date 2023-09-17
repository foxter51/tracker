const { authenticateToken } = require('../config/jwt.config')
const RoleController = require('../controllers/role.controller')

let router = require('express').Router()

router.get('/roles', authenticateToken, RoleController.findAll)

module.exports = router