const { authenticateToken } = require('../config/jwt.config')
const EpicController = require('../controllers/epic.controller')

let router = require('express').Router()

router.post('/productBacklogs/:productBacklogId/epics', authenticateToken, EpicController.create)

module.exports = router