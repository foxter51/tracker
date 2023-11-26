const db = require('../models')
const nodeSchedule = require("node-schedule")

const Sprint = db.sprint

const SprintBacklog = db.sprintBacklog
const Project = db.project
const UserStory = db.userStory
const Task = db.task
const User = db.user

async function create(sprintData) {
    const { name, startDate, duration, goal, projectId } = sprintData

    try {
        const project = await Project.findByPk(projectId)

        if(!project){
            throw new Error('Project not found')
        }

        const sprint = await Sprint.create({
            name,
            startDate,
            duration,
            goal,
            ProjectId: projectId
        })

        await SprintBacklog.create({
            storyPointsTotal: 0,
            SprintId: sprint.id
        })

        return { sprint }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function setNextSprint(projectId) {
    try {
        const project = await Project.findByPk(projectId, {
            include: [
                { model: Sprint, as: 'sprints' },
                { model: Sprint, as: 'currentSprint' }
            ]
        })

        if (!project) {
            throw new Error('Project not found')
        }

        const sortedSprints = project.sprints.sort((a, b) => {
            return b.startDate - a.startDate
        })

        let nextSprint
        let nextSprintIndex = -2

        if(project.currentSprint){  // if there is a current sprint
            nextSprintIndex = sortedSprints.findIndex(sprint => sprint.startDate < project.currentSprint.startDate)
            if (nextSprintIndex === -1) nextSprint = null  // if there is no next sprint
            else nextSprint = sortedSprints[nextSprintIndex]  // if there is a next sprint
        } else nextSprint = sortedSprints[0]  // if the sprint is the first one

        await project.setCurrentSprint(nextSprint)

        await project.save()

        let scheduledDate

        if(nextSprintIndex !== -1) {  // if there is a next sprint
            const scheduledTime = nextSprint.duration * 7 * 24 * 60 * 60 * 1000
            scheduledDate = new Date(nextSprint.startDate.getTime() + scheduledTime)
            // scheduledDate = new Date((new Date()).getTime() + 60 * 1000)  // only for testing
            nodeSchedule.scheduleJob(scheduledDate, () => {  // scheduling the next sprint
                setNextSprint(projectId)
            })
        }

        return { endDate: scheduledDate }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAll(projectId) {
    try {
        const project = await Project.findByPk(projectId)

        if (!project) {
            throw new Error('Project not found')
        }

        const sprints = await project.getSprints()

        return { sprints }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAllSprintTasksByStatus(sprintId, assigneeId, status) {
    try {
        const where = {}
        if (assigneeId !== 'null') {
            where.assigneeId = assigneeId
        }

        const sprint = await Sprint.findByPk(sprintId, {
            include: {
                model: SprintBacklog,
                include: [{
                    model: UserStory, as: 'userStories',
                    include: [{
                        model: Task, as: 'tasks',
                        where: { status, ...where },
                        include: {
                            model: User, as: 'assignee',
                            attributes: ['id', 'lastname', 'firstname']
                        }
                    }]
                }]
            }
        })

        if(!sprint) {
            throw new Error('Sprint not found')
        }

        // map tasks to include userStory name
        return {
            tasks: sprint.SprintBacklog.userStories.map(us =>
                us.tasks.map(task => ({
                    ...task.dataValues,
                    UserStory: us
                }))
            ).flat()
        }

    } catch (err) {
        throw new Error(err.message)
    }
}

async function destroy(sprintId) {
    try {
        await Sprint.destroy({
            where: { id: sprintId }
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    setNextSprint,
    findAll,
    findAllSprintTasksByStatus,
    destroy
}