const ProductBacklogService = require('../services/productBacklog.service')

async function create(req, res) {
    const { projectId } = req.params
    const { name, description, ownerId } = req.body

    try{
        const productBacklogData = {
            name,
            description,
            ownerId,
            projectId
        }
        const productBacklog = await ProductBacklogService.create(productBacklogData)
        res.json(productBacklog)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findOne(req, res) {
    const { projectId } = req.params

    try {
        const productBacklog = await ProductBacklogService.findOne(projectId)
        res.json(productBacklog)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findOne
}