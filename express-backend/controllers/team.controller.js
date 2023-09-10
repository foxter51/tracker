const teamService = require('../services/team.service')

async function create(req, res) {
    const { name } = req.body

    try {
        const team = await teamService.create(name)
        res.json(team)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findAll(req, res) {
    try {
        const teams = await teamService.findAll()
        res.json(teams)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findAll
}