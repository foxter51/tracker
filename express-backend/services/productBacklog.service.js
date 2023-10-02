const db = require('../models')
const ProductBacklog = db.productBacklog

const User = db.user
const Project = db.project
const Epic = db.epic
const UserStory = db.userStory
const Task = db.task

async function create(productBacklogData) {
    const { name, description, ownerId, projectId } = productBacklogData

    try {
        const owner = await User.findByPk(ownerId)

        if(!owner){
            throw new Error('User not found')
        }

        const project = await Project.findByPk(projectId)

        if(!project){
            throw new Error('Project not found')
        }

        const productBacklog = await ProductBacklog.create({
            name,
            description,
        })

        await productBacklog.setOwner(owner)
        await productBacklog.setProject(project)

        await productBacklog.save()

        return { productBacklog }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findOne(projectId) {
    try{
        const productBacklog = await ProductBacklog.findOne({
            where: {ProjectId: projectId},
            include: {
                model: Epic, as: 'epics',
                include: {
                    model: UserStory, as: 'userStories',
                    include: {
                        model: Task, as: 'tasks'
                    }
                }
            }
        })
        return { productBacklog }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findOne
}