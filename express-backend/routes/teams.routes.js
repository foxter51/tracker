const teamController = require('../controllers/team.controller')

let router = require('express').Router()

router.post('/teams', teamController.create)
router.get('/teams', teamController.findAll)

module.exports = router