const { authenticateToken } = require('../config/jwt.config')
const projectController = require('../controllers/project.controller')

let router = require('express').Router()

router.post('/projects', authenticateToken, projectController.create)
router.get('/projects/:id', authenticateToken, projectController.findOne)

module.exports = router