const userRoleService = require('../services/userRole.service')

async function create(req, res){
    const { teamId } = req.params
    const { userId, roleId } = req.body

    try {
        const userRoleData = {
            userId,
            teamId,
            roleId
        }
        const userRole = await userRoleService.create(userRoleData)
        res.json(userRole)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create
}