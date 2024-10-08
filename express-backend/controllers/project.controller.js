const projectService = require('../services/project.service')

async function create(req, res) {
    const { name, description, teamId, githubLink } = req.body

    try {
        const projectData = {
            name,
            description,
            teamId,
            githubLink
        }
        const project = await projectService.create(projectData)
        res.json(project)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findOne(req, res) {
    const { id } = req.params

    try {
        const project = await projectService.findOne(id)
        res.json(project)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findAllByUser(req, res) {
    const { userId } = req.params

    try {
        const projects = await projectService.findAllByUser(userId)
        res.json(projects)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findOne,
    findAllByUser
}