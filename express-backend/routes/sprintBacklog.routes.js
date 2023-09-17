const { authenticateToken } = require('../config/jwt.config')
const SprintBacklogController = require('../controllers/sprintBacklog.controller')

let router = require('express').Router()

router.post('/sprints/:sprintId/sprintBacklogs', authenticateToken, SprintBacklogController.create)

module.exports = router