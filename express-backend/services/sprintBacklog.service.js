const db = require('../models')
const SprintBacklog = db.sprintBacklog

const Sprint = db.sprint

async function create(sprintBacklogData) {
    const { totalStoryPoints, sprintId } = sprintBacklogData

    try {
        const sprint = await Sprint.findByPk(sprintId)

        if(!sprint){
            throw new Error('Sprint not found')
        }

        const sprintBacklog = await SprintBacklog.create({
            totalStoryPoints,
        })

        await sprintBacklog.setSprint(sprint)

        await sprintBacklog.save()

        return { sprintBacklog }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create
}