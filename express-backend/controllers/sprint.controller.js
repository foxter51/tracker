const sprintService = require('../services/sprint.service')

async function create(req, res){
    const { projectId } = req.params
    const { name, duration, goal } = req.body

    try {
        const sprintData = {
            name,
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

module.exports = {
    create
}