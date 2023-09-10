const userController = require('../controllers/user.controller.js')

let router = require('express').Router()

router.get('/users/:id', userController.findOne)
router.get('/users', userController.findAll)
router.patch('/users/:id', userController.update)
router.delete('/users/:id', userController.destroy)

module.exports = router