const TaskController = require('../controllers/task.controller')

let router = require('express').Router()

router.post('/userStories/:userStoryId/tasks', TaskController.create)

module.exports = router