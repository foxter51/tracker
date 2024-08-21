const { authenticateToken } = require('../config/jwt.config')
const userController = require('../controllers/user.controller.js')

let router = require('express').Router()

router.get('/users/:id', authenticateToken, userController.findOne)
router.get('/users', authenticateToken, userController.findAll)
router.patch('/users/:id', authenticateToken, userController.update)
router.delete('/users/:id', authenticateToken, userController.destroy)

module.exports = router