const { authenticateToken } = require('../config/jwt.config')
const TaskController = require('../controllers/task.controller')

let router = require('express').Router()

router.post('/userStories/:userStoryId/tasks', authenticateToken, TaskController.create)
router.get('/userStories/:userStoryId/tasks', authenticateToken, TaskController.findAll)
router.patch('/tasks/:taskId', authenticateToken, TaskController.updateTaskStatus)
router.delete('/tasks/:taskId', authenticateToken, TaskController.destroy)

module.exports = router