const db = require('../models')
const UserStory = db.userStory

const User = db.user
const Epic = db.epic
const ProductBacklog = db.productBacklog
const SprintBacklog = db.sprintBacklog
const Sprint = db.sprint

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

        if (!priority) {
            throw new Error('Priority not found')
        }

        if (!storyPoints) {
            throw new Error('Story Points not found')
        }

        if (!status) {
            throw new Error('Status not found')
        }

        const userStory = await UserStory.create({
            title,
            description,
            priority,
            storyPoints,
            status,
            EpicId: epicId,
            ownerId
        })

        return { userStory }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAllByEpic(epicId) {
    try {
        const epic = await Epic.findByPk(epicId)

        if(!epic){
            throw new Error('Epic not found')
        }

        const userStories = await UserStory.findAll({
            where: { EpicId: epicId },
            include: {
                model: User, as: 'owner'
            }
        })
        return { userStories }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findUnassignedUserStories(projectId) {
    try {
        const sprints = await Sprint.findAll({
            where: { ProjectId: projectId },
            include: {
                model: SprintBacklog,
                include: [
                    { model: UserStory, as: 'userStories' }
                ]
            }
        })
        
        if (!sprints?.length) throw new Error('No sprints found')

        const assignedUserStoryIds = sprints
            .flatMap(sprint => sprint.SprintBacklog.userStories)
            .map(userStory => userStory.id)

        const productBacklogEpics = await ProductBacklog.findOne({
            where: { ProjectId: projectId },
            include: [
                {
                    model: Epic, as: 'epics',
                    include: [
                        {
                            model: UserStory, as: 'userStories',
                            include: {
                                model: User, as: 'owner'
                            }
                        }
                    ]
                }
            ]
        })
        if (!productBacklogEpics) throw new Error('Product backlog not found')

        const productBacklogUserStories = productBacklogEpics.epics.flatMap(epic => epic.userStories)

        const unassignedUserStories = productBacklogUserStories.filter(
            userStory => !assignedUserStoryIds.includes(userStory.id)
        )

        return { userStories: unassignedUserStories }
    } catch (err) {
        throw new Error(err)
    }
}

async function destroy(userStoryId) {
    try{
        await UserStory.destroy({
            where: { id: userStoryId }
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

async function removeFromSprintBacklog(userStoryId) {
    try{
        const userStory = await UserStory.findByPk(userStoryId)

        if(!userStory){
            throw new Error('User Story not found')
        }

        const updatedUserStory = await userStory.update({ SprintBacklogId: null, returning: true })

        return { userStory: updatedUserStory }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findAllByEpic,
    findUnassignedUserStories,
    destroy,
    removeFromSprintBacklog
}