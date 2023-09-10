const taskService = require('../services/task.service')

async function create(req, res) {
    const { userStoryId } = req.params
    const { title, description, priority, storyPoints, status, assigneeId } = req.body

    try {
        const taskData = {
            title,
            description,
            priority,
            storyPoints,
            status,
            assigneeId,
            userStoryId
        }
        const task = await taskService.create(taskData)
        res.json(task)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create
}