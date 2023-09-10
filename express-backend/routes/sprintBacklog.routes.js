const SprintBacklogController = require('../controllers/sprintBacklog.controller')

let router = require('express').Router()

router.post('/sprints/:sprintId/sprintBacklogs', SprintBacklogController.create)

module.exports = router