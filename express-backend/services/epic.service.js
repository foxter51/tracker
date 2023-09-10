const db = require('../models')
const Epic = db.epic

async function create(epicData) {
    const { title, description, priority, storyPoints, status, productBacklogId } = epicData

    try {
        const productBacklog = await Epic.findByPk(productBacklogId)

        if(!productBacklog) {
            throw new Error('Product Backlog not found')
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

module.exports = {
    create
}