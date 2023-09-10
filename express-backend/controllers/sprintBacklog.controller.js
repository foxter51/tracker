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

module.exports = {
    create
}