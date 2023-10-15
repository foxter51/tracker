const { authenticateToken } = require('../config/jwt.config')
const TaskController = require('../controllers/task.controller')

let router = require('express').Router()

router.post('/userStories/:userStoryId/tasks', authenticateToken, TaskController.create)
router.get('/userStories/:userStoryId/tasks', authenticateToken, TaskController.findAll)

module.exports = router