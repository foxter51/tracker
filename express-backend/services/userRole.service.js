const db = require('../models')
const UserRole = db.userRole

const User = db.user
const Team = db.team
const Role = db.role

async function create(userRoleData){
    const {userId, teamId, roleId} = userRoleData
    try{
        const user = await User.findByPk(userId)
        const team = await Team.findByPk(teamId)
        const role = await Role.findByPk(roleId)

        if(!user){
            throw new Error('User not found')
        }
        if(!team){
            throw new Error('Team not found')
        }
        if(!role){
            throw new Error('Role not found')
        }

        const userRole = await UserRole.create({})

        await userRole.setUser(user)
        await userRole.setTeam(team)
        await userRole.setRole(role)

        await userRole.save()

        return { teamMember: userRole }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create
}