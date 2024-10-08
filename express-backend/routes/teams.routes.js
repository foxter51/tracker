const { authenticateToken } = require('../config/jwt.config')
const teamController = require('../controllers/team.controller')

let router = require('express').Router()

router.post('/teams', authenticateToken, teamController.create)
router.get('/teams', authenticateToken, teamController.findAll)
router.get('/teams/:id', authenticateToken, teamController.findOne)
router.delete('/teams/:id', authenticateToken, teamController.destroy)
router.delete('/teams/:teamId/users/:userId', authenticateToken, teamController.removeUserFromTeam)
router.put('/teams/:teamId', authenticateToken, teamController.addUsersToTeam)

module.exports = router