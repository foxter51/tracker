const db = require('../models')
const Team = db.team

async function create(teamName) {
    try {
        const team = await Team.create({
            name: teamName
        })
        return { team }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAll() {
    try {
        const teams = await Team.findAll()
        return { teams }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findAll
}