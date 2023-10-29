const db = require('../models')
const Sprint = db.sprint

const SprintBacklog = db.sprintBacklog
const Project = db.project

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
        const project = await Project.findByPk(projectId, { include: { model: Sprint, as: 'sprints' } })

        if (!project) {
            throw new Error('Project not found')
        }

        const sprints = project.sprints.sort((a, b) => {
            return a.startDate - b.startDate
        })

        const nextSprint = sprints.find(sprint => {
            return sprint.startDate > Date.now()
        })

        await project.setCurrentSprint(nextSprint)

        await project.save()

        return { nextSprint }
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

module.exports = {
    create,
    setNextSprint,
    findAll
}