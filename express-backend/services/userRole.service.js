const db = require('../models')
const UserRole = db.userRole

const User = db.user
const Team = db.team
const Role = db.role

async function create(userRolesData){

    if(userRolesData.length > 8 || userRolesData.length < 3){
        throw new Error('Invalid number of team members')
    }

    try{
        const createdUserRoles = []
        let productOwnersCount = 0
        let scrumMastersCount = 0

        for (const entry of userRolesData) {
            const { userId, roleId, teamId } = entry

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

            if(role.scrumRole === 'Product Owner'){
                productOwnersCount++
            }

            if(role.scrumRole === 'Scrum Master'){
                scrumMastersCount++
            }

            if(productOwnersCount > 1 || scrumMastersCount > 1){
                throw new Error('Product Owner and Scrum Master must be a maximum of 1')
            }

            const userRole = await UserRole.create({})

            await userRole.setUser(user)
            await userRole.setTeam(team)
            await userRole.setRole(role)

            const savedUserRole = await userRole.save()

            createdUserRoles.push(savedUserRole)
        }

        return { teamMembers: createdUserRoles }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create
}