const taskService = require('../services/task.service')

async function create(req, res) {
    const { userStoryId } = req.params
    const { title, description, priority, storyPoints, status, attachmentLink } = req.body

    try {
        const taskData = {
            title,
            description,
            priority,
            storyPoints,
            status,
            attachmentLink,
            userStoryId
        }
        const task = await taskService.create(taskData)
        res.json(task)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findAll(req, res) {
    const { userStoryId } = req.params

    try {
        const tasks = await taskService.findAll(userStoryId)
        res.json(tasks)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function updateTaskStatus(req, res) {
    const { taskId } = req.params
    const { status, assigneeId } = req.body

    try {
        const task = await taskService.updateTaskStatus(taskId, status, assigneeId)
        res.json(task)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function destroy(req, res) {
    const { taskId } = req.params

    try{
        await taskService.destroy(taskId)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findAll,
    updateTaskStatus,
    destroy
}