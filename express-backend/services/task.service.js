const db = require('../models')
const Task = db.task
const UserStory = db.userStory

const User = db.user

async function create(taskData) {
    const { title, description, priority, storyPoints, status, userStoryId } = taskData

    try{
        const userStory = await UserStory.findByPk(userStoryId)

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

        await task.setUserStory(userStory)

        await task.save()

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
                model: User,
                as: 'assignee'
            }
        })
        return { tasks }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findAll
}