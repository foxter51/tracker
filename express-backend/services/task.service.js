const db = require('../models')
const Task = db.task
const UserStory = db.userStory

const User = db.user

async function create(taskData) {
    const { title, description, priority, storyPoints, status, attachmentLink, userStoryId } = taskData

    try{
        const userStory = await UserStory.findByPk(userStoryId)

        if(!userStory){
            throw new Error('User Story not found')
        }

        if (!priority) {
            throw new Error('Priority not found')
        }

        if (!storyPoints) {
            throw new Error('Story Points not found')
        }

        if (!status) {
            throw new Error('Status not found')
        }

        const task = await Task.create({
            title,
            description,
            priority,
            storyPoints,
            status,
            attachmentLink,
            UserStoryId: userStoryId
        })

        return { task }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAll(userStoryId) {
    try {
        const tasks = await Task.findAll({
            where: { UserStoryId: userStoryId },
            include: {
                model: User, as: 'assignee'
            }
        })
        return { tasks }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function updateTaskStatus(taskId, status, assigneeId) {
    try {
        const task = await Task.findByPk(taskId)

        const updatedTask = status !== "TO DO" ?
            await task.update({ status, assigneeId, returning: true }) :
            await task.update({ status, assigneeId: null, returning: true })

        return {task: updatedTask}
    } catch (err) {
        throw new Error(err.message)
    }
}

async function destroy(taskId) {
    try {
        await Task.destroy({
            where: { id: taskId }
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findAll,
    updateTaskStatus,
    destroy
}