const SprintBacklogService = require('../services/sprintBacklog.service')

async function create(req, res){
    const { sprintId } = req.params
    const { totalStoryPoints } = req.body

    try{
        const sprintBacklogData = {
            totalStoryPoints,
            sprintId
        }
        const sprintBacklog = await SprintBacklogService.create(sprintBacklogData)
        res.json(sprintBacklog)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findOne(req, res){
    const { sprintId } = req.params

    try {
        const sprintBacklog = await SprintBacklogService.findOne(sprintId)
        res.json(sprintBacklog)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function addUserStories(req, res) {
    const { sprintBacklogId } = req.params
    const { userStoriesIds } = req.body

    try {
        const userStories = await SprintBacklogService.addUserStories(sprintBacklogId, userStoriesIds)
        res.json(userStories)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findOne,
    addUserStories
}