const db = require('../models')
const Team = db.team
const UserRole = db.userRole
const User = db.user
const Role = db.role
const userRoleService = require('../services/userRole.service')

async function create(teamData, userRolesData, authUserId) {
    let team
    try {
        team = await Team.create({
            name: teamData.name
        })
        await userRoleService.create(team.id, userRolesData, authUserId)
        return { team }
    } catch (err) {
        if (team) await team.destroy()
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
                {
                    model: UserRole,
                    as: 'userRoles',
                    include: [
                        { model: User },
                        { model: Role }
                    ] 
                }
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

async function removeUserFromTeam(teamId, userId) {
    try{
        await UserRole.destroy({
            where: { TeamId: teamId, UserId: userId }
        })

        const team = await Team.findByPk(teamId, {
            include: [
                { model: UserRole, as: 'userRoles' }
            ]
        })
        
        const teamUserRoles = team.userRoles

        if(teamUserRoles.length === 0){
            await Team.destroy({
                where: { id: teamId }
            })
        }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findAll,
    findOne,
    destroy,
    removeUserFromTeam
}