const db = require('../models')
const Project = db.project
const Team = db.team
const ProductBacklog = db.productBacklog
const UserRole = db.userRole
const Role = db.role
const User = db.user

async function create(projectData) {
    const { name, description, teamId } = projectData

    try{
        const team = await Team.findByPk(teamId, {
            include: {
                model: UserRole,
                as: 'userRoles',
                include: [
                    {model: Role, where: { scrumRole: 'Product Owner' }},
                    {model: User}
                ]
            }
        })
        const owner = team.userRoles[0].User

        if(!team){
            throw new Error('Team not found')
        }

        if(!owner){
            throw new Error('Product Owner not found')
        }

        const project = await Project.create({
            name,
            description,
        })
        const productBacklog = await ProductBacklog.create({
            name: 'default name',
            description: 'default description',
        })

        await productBacklog.setOwner(owner)
        await project.setTeam(team)
        await project.setProductBacklog(productBacklog)
        await project.save()

        return { project }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findOne(projectId) {
    try{
        const project = await Project.findByPk(projectId, {
            include: {
                model: Team,
                include: {
                    model: UserRole, as: 'userRoles',
                    include: [
                        { model: User, Role },
                    ]
                }
            }
        })

        if(!project){
            throw new Error('Project not found')
        }

        return { project }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAllByUser(userId) {
    try {
        const projects = await Project.findAll({
            include: {
                model: Team,
                include: {
                    model: UserRole,
                    as: 'userRoles',
                    include: [
                        { model: User,
                            where: { id: userId }
                        }
                    ]
                }
            }
        })

        return { projects }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findOne,
    findAllByUser
}