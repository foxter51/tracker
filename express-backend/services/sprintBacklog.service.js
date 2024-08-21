const db = require('../models')
const SprintBacklog = db.sprintBacklog

const Sprint = db.sprint
const UserStory = db.userStory

async function create(sprintBacklogData) {
    const { totalStoryPoints, sprintId } = sprintBacklogData

    try {
        const sprint = await Sprint.findByPk(sprintId)

        if(!sprint){
            throw new Error('Sprint not found')
        }

        const sprintBacklog = await SprintBacklog.create({
            totalStoryPoints,
            SprintId: sprintId
        })

        return { sprintBacklog }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findOne(sprintId) {
    try {
        const sprintBacklog = await SprintBacklog.findOne({
            where: { SprintId: sprintId },
            include: [
                { model: UserStory, as: 'userStories' }
            ]
        })

        if(!sprintBacklog){
            throw new Error('Sprint Backlog not found')
        }

        return { sprintBacklog }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function addUserStories(sprintBacklogId, userStoriesIds) {
    try {
        const sprintBacklog = await SprintBacklog.findByPk(sprintBacklogId, {
            include: [
                { model: UserStory, as: 'userStories' }
            ]
        })

        if(!sprintBacklog){
            throw new Error('Sprint Backlog not found')
        }

        const savedUserStories = await UserStory.update({
            SprintBacklogId: sprintBacklogId
        }, {
            where: { id: userStoriesIds },
            returning: true
        })

        return { userStories: savedUserStories[1] }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findOne,
    addUserStories
}