const RoleController = require('../controllers/role.controller')

let router = require('express').Router()

router.get('/roles', RoleController.findAll)

module.exports = router