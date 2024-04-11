const db = require('../models')
const UserRole = db.userRole

const User = db.user
const Role = db.role
const Team = db.team

async function create(teamId, userRolesData, authUserId) {

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

    if (!team) {
        throw new Error('Team not found')
    }

    if (userRolesData.length + team.userRoles?.length > 8 || userRolesData.length + team.userRoles?.length < 3){
        throw new Error('Invalid number of team members')
    }

    console.log(userRolesData.length + team.userRoles?.length)

    if (!userRolesData.some(user => user.userId === authUserId) && !team.userRoles?.some(user => user.UserId === authUserId)) {
        throw new Error('You cannot create a team without yourself as a member')
    }

    const createdUserRoles = []
    try{
        let productOwnersCount = team.userRoles?.filter(userRole => userRole.Role.scrumRole === 'Product Owner').length
        let scrumMastersCount = team.userRoles?.filter(userRole => userRole.Role.scrumRole === 'Scrum Master').length
        let developersCount = team.userRoles?.filter(userRole => userRole.Role.scrumRole === 'Developer').length

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
                throw new Error('Product Owner and Scrum Master each must be a maximum of 1')
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