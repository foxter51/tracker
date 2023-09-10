const userRoleController = require('../controllers/userRole.controller')

let router = require('express').Router()

router.post('/teams/:teamId/userRoles', userRoleController.create)

module.exports = router