const sprintService = require('../services/sprint.service')

async function create(req, res){
    const { projectId } = req.params
    const { name, startDate, duration, goal } = req.body

    try {
        const sprintData = {
            name,
            startDate,
            duration,
            goal,
            projectId
        }
        const sprint = await sprintService.create(sprintData)
        res.json(sprint)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function setNextSprint(req, res){
    const { projectId } = req.params

    try {
        const sprint = await sprintService.setNextSprint(projectId)
        res.json(sprint)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findAll(req, res) {
    const { projectId } = req.params

    try {
        const sprints = await sprintService.findAll(projectId)
        res.json(sprints)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findAllSprintTasksByStatus(req, res) {
    const { sprintId } = req.params
    const { assigneeId } = req.params
    const { status } = req.query

    try {
        const tasks = await sprintService.findAllSprintTasksByStatus(sprintId, assigneeId, status)
        res.json(tasks)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function destroy(req, res) {
    const { sprintId } = req.params

    try{
        await sprintService.destroy(sprintId)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    setNextSprint,
    findAll,
    findAllSprintTasksByStatus,
    destroy
}