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

async function findAll(req, res) {
    const { projectId } = req.params

    try {
        const sprints = await sprintService.findAll(projectId)
        res.json(sprints)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findAll
}