const dbConfig = require('../config/db.config.js')
const io = require('../config/socket')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user.model.js')(sequelize)
db.userRole = require('./userRole.model.js')(sequelize)
db.role = require('./role.model.js')(sequelize)
db.team = require('./team.model.js')(sequelize)
db.project = require('./project.model.js')(sequelize)
db.productBacklog = require('./productBacklog.model.js')(sequelize)
db.epic = require('./epic.model.js')(sequelize)
db.userStory = require('./userStory.model.js')(sequelize)
db.sprint = require('./sprint.model.js')(sequelize)
db.sprintBacklog = require('./sprintBacklog.model.js')(sequelize)
db.task = require('./task.model.js')(sequelize)

db.user.hasMany(db.userRole, { as: 'userRoles', onDelete: 'CASCADE' })

db.team.hasMany(db.project, { as: 'projects', onDelete: 'CASCADE' })
db.team.hasMany(db.userRole, { as: 'userRoles', onDelete: 'CASCADE' })

db.project.hasOne(db.productBacklog, { onDelete: 'CASCADE' })
db.project.hasMany(db.sprint, { as: 'sprints', onDelete: 'CASCADE' })
db.project.hasOne(db.sprint, { as: 'currentSprint', onDelete: 'CASCADE' })

db.sprint.hasOne(db.sprintBacklog, { onDelete: 'CASCADE' })

db.sprintBacklog.hasMany(db.userStory, { as: 'userStories' })

db.userStory.hasMany(db.task, { as: 'tasks', onDelete: 'CASCADE' })

db.epic.hasMany(db.userStory, { as: 'userStories', onDelete: 'CASCADE' })

db.productBacklog.hasMany(db.epic, { as: 'epics', onDelete: 'CASCADE' })


db.user.belongsToMany(db.team, { through: db.userRole })

db.userRole.belongsTo(db.user)
db.userRole.belongsTo(db.team)
db.userRole.belongsTo(db.role)

db.project.belongsTo(db.team)

db.sprint.belongsTo(db.project)

db.sprintBacklog.belongsTo(db.sprint)

db.userStory.belongsTo(db.epic)
db.userStory.belongsTo(db.user, { as: 'owner' })

db.epic.belongsTo(db.productBacklog)

db.task.belongsTo(db.userStory)
db.task.belongsTo(db.user, { as: 'assignee' })

db.productBacklog.belongsTo(db.project)
db.productBacklog.belongsTo(db.user, { as: 'owner' })

db.task.afterUpdate(async task => await updateUserStoryStatus(task))
db.task.afterCreate(async task => await updateUserStoryStatus(task))
db.task.beforeDestroy(async task => await updateUserStoryStatus(task, true))

db.userStory.afterCreate(async userStory => await updateEpicStatus(userStory))
db.userStory.afterUpdate(async userStory => await updateEpicStatus(userStory))
db.userStory.beforeDestroy(async userStory => await updateEpicStatus(userStory, true))

const updateUserStoryStatus = async (task, skip = false) => {
    const userStoryId = task.UserStoryId
    const userStory = await db.userStory.findByPk(userStoryId)

    let storyTasks = await userStory.getTasks()
    if(skip) storyTasks = storyTasks.filter(t => t.id !== task.id)

    const statuses = new Set(storyTasks.map(task => task.status))

    if(statuses.size === 1) {
        const status = storyTasks[0].status
        await userStory.update({ status })
    } else if (Array.from(statuses).some(status => status === 'TO DO')) {
        await userStory.update({ status: 'TO DO' })
    } else if (Array.from(statuses).some(status => status === 'IN PROGRESS')) {
        await userStory.update({ status: 'IN PROGRESS' })
    } else if (Array.from(statuses).some(status => status === 'IN REVIEW')) {
        await userStory.update({ status: 'IN REVIEW' })
    } else {
        await userStory.update({ status: 'DONE' })
    }

    io.emit('task update', { userStoryId, userStoryStatus: userStory.status, taskId: task.id, taskStatus: task.status, sprintBacklogId: userStory.SprintBacklogId })
}

const updateEpicStatus = async (userStory, skip = false) => {
    const epicId = userStory.EpicId
    const epic = await db.epic.findByPk(epicId)

    let epicUserStories = await epic.getUserStories()
    if(skip) epicUserStories = epicUserStories.filter(story => story.id !== userStory.id)

    const statuses = new Set(epicUserStories.map(story => story.status))

    if(statuses.size === 1) {
        const status = epicUserStories[0].status
        await epic.update({ status })
    } else if (Array.from(statuses).some(status => status === 'TO DO')) {
        await epic.update({ status: 'TO DO' })
    } else if (Array.from(statuses).some(status => status === 'IN PROGRESS')) {
        await epic.update({ status: 'IN PROGRESS' })
    } else if (Array.from(statuses).some(status => status === 'IN REVIEW')) {
        await epic.update({ status: 'IN REVIEW' })
    } else {
        await epic.update({ status: 'DONE' })
    }

    io.emit('user story update', { epicId, epicStatus: epic.status })
}

module.exports = db