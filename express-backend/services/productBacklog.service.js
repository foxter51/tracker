const db = require('../models')
const ProductBacklog = db.productBacklog

const User = db.user
const Project = db.project

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

module.exports = {
    create
}