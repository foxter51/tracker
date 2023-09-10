const projectController = require('../controllers/project.controller')

let router = require('express').Router()

router.post('/projects', projectController.create)
router.get('/projects/:id', projectController.findOne)

module.exports = router