const { authenticateToken } = require('../config/jwt.config')
const SprintController = require('../controllers/sprint.controller')

let router = require('express').Router()

router.post('/projects/:projectId/sprints', authenticateToken, SprintController.create)
router.get('/projects/:projectId/sprints', authenticateToken, SprintController.findAll)
router.get('/sprints/:sprintId/assignee/:assigneeId/tasks', authenticateToken, SprintController.findAllSprintTasksByStatus)
router.delete('/sprints/:sprintId', authenticateToken, SprintController.destroy)
router.patch('/projects/:projectId/nextSprint', authenticateToken, SprintController.setNextSprint)

module.exports = router