const db = require('../models')
const Sprint = db.sprint

const Project = db.project

async function create(sprintData) {
    const { name, duration, goal, projectId } = sprintData

    try {
        const project = await Project.findByPk(projectId)

        if(!project){
            throw new Error('Project not found')
        }

        const sprint = await Sprint.create({
            name,
            duration,
            goal
        })

        sprint.setProject(project)

        await sprint.save()

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

module.exports = {
    create,
    setNextSprint
}