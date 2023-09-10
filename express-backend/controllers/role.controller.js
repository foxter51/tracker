const RoleService = require('../services/role.service')

async function findAll(req, res){
    try {
        const roles = await RoleService.findAll()
        res.json(roles)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    findAll
}