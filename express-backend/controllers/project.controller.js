const projectService = require('../services/project.service')

async function create(req, res) {
    const { name, description, team_id } = req.body

    try {
        const projectData = {
            name,
            description,
            team_id
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

module.exports = {
    create,
    findOne
}