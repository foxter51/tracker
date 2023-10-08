const userStoryService = require('../services/userStory.service')

async function create(req, res) {
    const { epicId } = req.params
    const { title, description, priority, storyPoints, status, ownerId } = req.body

    try {
        const userStoryData = {
            title,
            description,
            priority,
            storyPoints,
            status,
            ownerId,
            epicId
        }
        const userStory = await userStoryService.create(userStoryData)
        res.json(userStory)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findAll(req, res) {
    const { epicId } = req.params

    try {
        const userStories = await userStoryService.findAll(epicId)
        res.json(userStories)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findAll
}