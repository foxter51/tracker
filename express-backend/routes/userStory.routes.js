const { authenticateToken } = require('../config/jwt.config')
const UserStoryController = require('../controllers/userStory.controller')

let router = require('express').Router()

router.post('/epics/:epicId/userStories', authenticateToken, UserStoryController.create)
router.get('/epics/:epicId/userStories', authenticateToken, UserStoryController.findAllByEpic)
router.get('/projects/:projectId/userStories', authenticateToken, UserStoryController.findUnassignedUserStories)
router.delete('/userStories/:userStoryId', authenticateToken, UserStoryController.destroy)
router.patch('/userStories/:userStoryId', authenticateToken, UserStoryController.removeFromSprintBacklog)

module.exports = router