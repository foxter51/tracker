const userRoleService = require('../services/userRole.service')

async function create(req, res){
    const userRolesData = req.body
    try {
        const userRoles = await userRoleService.create(userRolesData)
        res.json(userRoles)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create
}