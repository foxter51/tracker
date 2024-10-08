const teamService = require('../services/team.service')

async function create(req, res) {
    const { teamData, userRolesData, authUserId } = req.body

    try {
        const team = await teamService.create(teamData, userRolesData, authUserId)
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

async function findOne(req, res) {
    const { id } = req.params

    try {
        const team = await teamService.findOne(id)
        res.json(team)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function destroy(req, res) {
    const { id } = req.params

    try{
        await teamService.destroy(id)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function removeUserFromTeam(req, res) {
    const { teamId, userId } = req.params

    try{
        await teamService.removeUserFromTeam(teamId, userId)
        res.json({ message: 'User removed from team' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function addUsersToTeam(req, res) {
    const { teamId } = req.params
    const { userRolesData, authUserId } = req.body

    try{
        const team = await teamService.addUsersToTeam(teamId, userRolesData, authUserId)
        res.json(team)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    create,
    findAll,
    findOne,
    destroy,
    removeUserFromTeam,
    addUsersToTeam
}