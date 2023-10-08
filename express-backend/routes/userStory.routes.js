const { authenticateToken } = require('../config/jwt.config')
const UserStoryController = require('../controllers/userStory.controller')

let router = require('express').Router()

router.post('/epics/:epicId/userStories', authenticateToken, UserStoryController.create)
router.get('/epics/:epicId/userStories', authenticateToken, UserStoryController.findAll)

module.exports = router