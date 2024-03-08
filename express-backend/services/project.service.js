const db = require('../models')
const Project = db.project
const Team = db.team
const ProductBacklog = db.productBacklog
const UserRole = db.userRole
const Role = db.role
const User = db.user
const Sprint = db.sprint

async function create(projectData) {
    const { name, description, teamId, githubLink } = projectData

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
        
        const owner = team.userRoles[0]?.User

        if(!team){
            throw new Error('Team not found')
        }

        if(!owner){
            throw new Error('Product Owner not found')
        }

        let githubRepoName

        if(!githubLink) {
            throw new Error('Github link not found')
        } else {
            const { repoName } = await getGithubRepoNameByLink(githubLink)
            if (!repoName) {
                throw new Error('Invalid Github Link')
            } else githubRepoName = repoName
        }

        const project = await Project.create({
            name,
            description,
            githubLink,
            githubRepoName
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
            include: [
                {
                    model: Team,
                    include: {
                        model: UserRole, as: 'userRoles',
                        include: [
                            { model: User, Role },
                        ]
                    },
                },
                {
                    model: Sprint, as: 'currentSprint',
                }
            ]
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
                required: true,
                include: {
                    model: UserRole,
                    as: 'userRoles',
                    required: true,
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

async function getGithubRepoNameByLink(githubLink) {
    try {
        const repoName = githubLink.split('/')[4].replace('.git', '')
        return { repoName }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findOne,
    findAllByUser
}