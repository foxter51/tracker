const db = require('../models')
const Epic = db.epic
const ProductBacklog = db.productBacklog
const UserStory = db.userStory
const Task = db.task

async function create(epicData) {
    const { title, description, priority, storyPoints, status, productBacklogId } = epicData

    try {
        const productBacklog = await ProductBacklog.findByPk(productBacklogId)

        if(!productBacklog) {
            throw new Error('Product Backlog not found')
        }

        if(!priority) {
            throw new Error('Priority not found')
        }

        if(!storyPoints) {
            throw new Error('Story Points not found')
        }

        if(!status) {
            throw new Error('Status not found')
        }

        const epic = await Epic.create({
            title,
            description,
            priority,
            storyPoints,
            status,
        })

        await epic.setProductBacklog(productBacklog)

        await epic.save()

        return { epic }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAll(productBacklogId) {
    try{
        const epics = await Epic.findAll({ where: { ProductBacklogId: productBacklogId } })
        return { epics }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findAll
}