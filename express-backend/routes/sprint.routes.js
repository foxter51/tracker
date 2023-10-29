const { authenticateToken } = require('../config/jwt.config')
const SprintController = require('../controllers/sprint.controller')

let router = require('express').Router()

router.post('/projects/:projectId/sprints', authenticateToken, SprintController.create)
router.get('/projects/:projectId/sprints', authenticateToken, SprintController.findAll)

module.exports = router