const db = require('../models')
const Role = db.role

async function findAll() {
    try {
        const roles = await Role.findAll()
        return { roles }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    findAll
}