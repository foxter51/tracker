const UserStoryController = require('../controllers/userStory.controller')

let router = require('express').Router()

router.post('/epics/:epicId/userStories', UserStoryController.create)

module.exports = router