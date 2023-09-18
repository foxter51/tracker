const db = require('../models')
const Team = db.team
const UserRole = db.userRole
const User = db.user
const Role = db.role

async function create(teamName) {
    try {
        const team = await Team.create({
            name: teamName
        })
        return { team }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAll() {
    try {
        const teams = await Team.findAll()
        return { teams }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findOne(teamId) {
    try {
        const team = await Team.findByPk(teamId, {
            include: [
                { model: UserRole, as: 'userRoles', include: [User, Role] }
            ]
        })
        return { team }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function destroy(teamId) {
    try{
        await Team.destroy({
            where: { id: teamId }
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findAll,
    findOne,
    destroy
}