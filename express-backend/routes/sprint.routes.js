const SprintController = require('../controllers/sprint.controller')

let router = require('express').Router()

router.post('/projects/:projectId/sprints', SprintController.create)

module.exports = router