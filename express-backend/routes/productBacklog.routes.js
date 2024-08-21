const { authenticateToken } = require('../config/jwt.config')
const ProductBacklogController = require('../controllers/productBacklog.controller')

let router = require('express').Router()

router.post('/projects/:projectId/productBacklogs', authenticateToken, ProductBacklogController.create)
router.get('/projects/:projectId/productBacklog', authenticateToken, ProductBacklogController.findOne)

module.exports = router