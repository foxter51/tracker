const { authenticateToken } = require('../config/jwt.config')
const SprintBacklogController = require('../controllers/sprintBacklog.controller')

let router = require('express').Router()

router.post('/sprints/:sprintId/sprintBacklog', authenticateToken, SprintBacklogController.create)
router.get('/sprints/:sprintId/sprintBacklog', authenticateToken, SprintBacklogController.findOne)
router.post('/sprintBacklogs/:sprintBacklogId/userStories', authenticateToken, SprintBacklogController.addUserStories)

module.exports = router