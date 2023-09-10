const ProductBacklogController = require('../controllers/productBacklog.controller')

let router = require('express').Router()

router.post('/projects/:projectId/productBacklogs', ProductBacklogController.create)

module.exports = router