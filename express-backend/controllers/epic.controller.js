const epicService = require('../services/epic.service')

async function create(req, res) {
    const { productBacklogId } = req.params
    const { title, description, priority, storyPoints, status } = req.body

    try {
        const epicData = {
            title,
            description,
            priority,
            storyPoints,
            status,
            productBacklogId
        }
        const epic = await epicService.create(epicData)
        res.json(epic)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create
}