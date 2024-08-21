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

async function findAllByEpic(req, res) {
    const { epicId } = req.params

    try {
        const userStories = await userStoryService.findAllByEpic(epicId)
        res.json(userStories)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findUnassignedUserStories(req, res) {
    const { projectId } = req.params

    try {
        const userStories = await userStoryService.findUnassignedUserStories(projectId)
        res.json(userStories)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function destroy(req, res) {
    const { userStoryId } = req.params

    try{
        await userStoryService.destroy(userStoryId)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function removeFromSprintBacklog(req, res) {
    const { userStoryId } = req.params

    try {
        const response = await userStoryService.removeFromSprintBacklog(userStoryId)
        res.json(response)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findAllByEpic,
    findUnassignedUserStories,
    destroy,
    removeFromSprintBacklog
}