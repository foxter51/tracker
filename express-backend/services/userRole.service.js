const db = require('../models')
const UserRole = db.userRole

const User = db.user
const Team = db.team
const Role = db.role

async function create(teamId, userRolesData){

    if(userRolesData.length > 8 || userRolesData.length < 3){
        throw new Error('Invalid number of team members')
    }

    const team = await Team.findByPk(teamId)

    if (!team) {
        throw new Error('Team not found')
    }

    const createdUserRoles = []
    try{
        let productOwnersCount = 0
        let scrumMastersCount = 0
        let developersCount = 0

        for (const entry of userRolesData) {
            const { userId, roleId } = entry
            
            const user = await User.findByPk(userId)
            const role = await Role.findByPk(roleId)

            if(!user){
                throw new Error('User not found')
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

            if(role.scrumRole === 'Developer'){
                developersCount++
            }

            if(productOwnersCount > 1 || scrumMastersCount > 1){
                throw new Error('Product Owner and Scrum Master must be a maximum of 1')
            }

            const userRole = await UserRole.create({
                UserId: user.id,
                TeamId: team.id,
                RoleId: role.id,
            })

            const savedUserRole = await userRole.save()

            createdUserRoles.push(savedUserRole)
        }

        if (developersCount < 1 || productOwnersCount < 1 || scrumMastersCount < 1) {
            throw new Error('At least 1 of each role is required')
        }

        return { teamMembers: createdUserRoles }
    } catch (err) {

        for (const entry of createdUserRoles){
            await entry.destroy()
        }

        throw new Error(err.message)
    }
}

module.exports = {
    create
}