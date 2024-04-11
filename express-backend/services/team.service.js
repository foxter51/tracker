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

        const userRolesAfterDeletion = team.userRoles.filter(userRole => userRole.User.id !== +userId)
        console.log("🚀 ~ removeUserFromTeam ~ userRolesAfterDeletion:", userRolesAfterDeletion.length)
        console.log("🚀 ~ removeUserFromTeam ~ team.userRoles:", team.userRoles.length)
        await checkConsistency(userRolesAfterDeletion)

        await UserRole.destroy({
            where: { TeamId: teamId, UserId: userId }
        })

        if (team.userRoles.length === 0) {
            await Team.destroy({
                where: { id: teamId }
            })
        }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function addUsersToTeam(teamId, userRolesData, authUserId) {
    try{
        await userRoleService.create(teamId, userRolesData, authUserId)
        return await findOne(teamId)
    } catch (err) {
        throw new Error(err.message)
    }
}

async function checkConsistency(teamUserRoles) {
    try{
        let productOwnersCount = 0
        let scrumMastersCount = 0
        let developersCount = 0

        for (const entry of teamUserRoles) {
            const { UserId, RoleId } = entry

            const user = await User.findByPk(UserId)
            const role = await Role.findByPk(RoleId)

            if (!user) {
                throw new Error('User not found')
            }
            if (!role) {
                throw new Error('Role not found')
            }

            if (role.scrumRole === 'Product Owner') {
                productOwnersCount++
            }

            if (role.scrumRole === 'Scrum Master') {
                scrumMastersCount++
            }

            if (role.scrumRole === 'Developer') {
                developersCount++
            }
        }

        if (developersCount < 1 || productOwnersCount < 1 || scrumMastersCount < 1) {
            throw new Error('At least 1 of each role is required')
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
    removeUserFromTeam,
    addUsersToTeam
}