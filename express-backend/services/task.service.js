const db = require('../models')
const Task = db.task

const User = db.user

async function create(taskData) {
    const { title, description, priority, storyPoints, status, assigneeId, userStoryId } = taskData

    try{
        const assignee = await User.findByPk(assigneeId)

        if(!assignee){
            throw new Error('User not found')
        }

        const userStory = await Task.findByPk(userStoryId)

        if(!userStory){
            throw new Error('User Story not found')
        }

        const task = await Task.create({
            title,
            description,
            priority,
            storyPoints,
            status,
        })

        await task.setAssignee(assignee)
        await task.setUserStory(userStory)

        await task.save()

        return { task }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create
}