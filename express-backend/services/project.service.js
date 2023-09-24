const db = require('../models')
const Project = db.project
const Team = db.team

async function create(projectData) {
    const { name, description, teamId } = projectData

    try{
        const team = await Team.findByPk(teamId)

        if(!team){
            throw new Error('Team not found')
        }

        const project = await Project.create({
            name,
            description,
        })

        await project.setTeam(team)

        await project.save()

        return { project }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findOne(projectId) {
    try{
        const project = await Project.findByPk(projectId, {
            include: [
                { model: Team }
            ]
        })

        if(!project){
            throw new Error('Project not found')
        }

        return { project }
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    create,
    findOne
}