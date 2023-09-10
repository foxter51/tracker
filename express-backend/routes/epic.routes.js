const EpicController = require('../controllers/epic.controller')

let router = require('express').Router()

router.post('/productBacklogs/:productBacklogId/epics', EpicController.create)

module.exports = router