const db = require('../models')
const UserStory = db.userStory

const User = db.user
const Epic = db.epic

async function create(userStoryData) {
    const { title, description, priority, storyPoints, status, ownerId, epicId } = userStoryData

    try {
        const owner = await User.findByPk(ownerId)

        if(!owner){
            throw new Error('User not found')
        }

        const epic = await Epic.findByPk(epicId)

        if(!epic){
            throw new Error('Epic not found')
        }

        const userStory = await UserStory.create({
            title,
            description,
            priority,
            storyPoints,
            status,
        })

        await userStory.setOwner(owner)
        await userStory.setEpic(epic)

        await userStory.save()

        return { userStory }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAll(epicId) {
    try {
        const userStories = await UserStory.findAll({
            where: { EpicId: epicId },
            include: {
                model: User,
                as: 'owner'
            }
        })
        return { userStories }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findAll
}